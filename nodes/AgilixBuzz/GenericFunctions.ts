import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IHttpRequestMethods,
	IRequestOptions,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

declare function setTimeout(callback: () => void, ms: number): unknown;

// ── Session cache (shared across executions within the same worker) ──────────
interface SessionInfo {
	token: string;
	expiration: number; // unix ms
}

const sessionCache = new Map<string, SessionInfo>();

// Tokens last ~15 min; refresh 2 min early
const TOKEN_REFRESH_BUFFER_MS = 2 * 60 * 1000;

function cacheKey(baseUrl: string, domain: string, username: string): string {
	return `${baseUrl}|${domain}|${username}`;
}

// ── Login / session management ───────────────────────────────────────────────
async function login(
	ctx: IExecuteFunctions | ILoadOptionsFunctions,
	baseUrl: string,
	domain: string,
	username: string,
	password: string,
): Promise<SessionInfo> {
	const options: IRequestOptions = {
		method: 'POST' as IHttpRequestMethods,
		uri: `${baseUrl}/cmd`,
		qs: { cmd: 'login2' },
		body: {
			request: {
				cmd: 'login2',
				username: `${domain}/${username}`,
				password,
			},
		},
		json: true,
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	};

	const response = await ctx.helpers.request(options);
	const body = typeof response === 'string' ? JSON.parse(response) : response;

	const resp = body?.response;
	if (!resp || resp.code !== 'OK') {
		throw new NodeApiError(ctx.getNode(), body as JsonObject, {
			message: `Login failed: ${resp?.code ?? 'unknown error'}`,
		});
	}

	const token = resp.user?.token as string;
	if (!token) {
		throw new NodeApiError(ctx.getNode(), body as JsonObject, {
			message: 'Login succeeded but no token was returned',
		});
	}

	const session: SessionInfo = {
		token,
		// Default 15-minute window
		expiration: Date.now() + 15 * 60 * 1000,
	};

	sessionCache.set(cacheKey(baseUrl, domain, username), session);
	return session;
}

async function extendSession(
	ctx: IExecuteFunctions | ILoadOptionsFunctions,
	baseUrl: string,
	token: string,
): Promise<void> {
	const options: IRequestOptions = {
		method: 'GET' as IHttpRequestMethods,
		uri: `${baseUrl}/cmd`,
		qs: { cmd: 'extendsession', _token: token },
		json: true,
		headers: { Accept: 'application/json' },
	};

	const response = await ctx.helpers.request(options);
	const body = typeof response === 'string' ? JSON.parse(response) : response;
	const resp = body?.response;
	if (!resp || resp.code !== 'OK') {
		// Session expired — caller should re-login
		throw new Error('extend_session_failed');
	}
}

async function getToken(
	ctx: IExecuteFunctions | ILoadOptionsFunctions,
): Promise<{ token: string; baseUrl: string }> {
	const creds = await ctx.getCredentials('agilixBuzzApi');
	const baseUrl = ((creds.baseUrl as string) || 'https://api.agilixbuzz.com').replace(/\/+$/, '');
	const domain = creds.domain as string;
	const username = creds.username as string;
	const password = creds.password as string;
	const key = cacheKey(baseUrl, domain, username);

	let session = sessionCache.get(key);

	if (session && session.expiration - Date.now() > TOKEN_REFRESH_BUFFER_MS) {
		return { token: session.token, baseUrl };
	}

	// Try extending
	if (session) {
		try {
			await extendSession(ctx, baseUrl, session.token);
			session.expiration = Date.now() + 15 * 60 * 1000;
			return { token: session.token, baseUrl };
		} catch {
			// Fall through to full login
		}
	}

	session = await login(ctx, baseUrl, domain, username, password);
	return { token: session.token, baseUrl };
}

// ── Rate-limit & time-limit aware request helper ─────────────────────────────
const MAX_RETRIES = 5;
const INITIAL_BACKOFF_MS = 1000;
const MAX_TIME_LIMIT_WAIT_MS = 180_000; // 3 min max wait for time-limiting

async function sleep(ms: number): Promise<void> {
	return new Promise<void>((resolve) => {
		setTimeout(resolve, ms);
	});
}

/**
 * Parse the retry delay from an Agilix TimeLimit response message.
 * Message format: "The API time has been limited for {userId}. You are {ms}ms over your limit."
 * Returns the number of milliseconds to wait before retrying.
 */
function parseTimeLimitDelay(message: string | undefined): number {
	if (!message) return 30_000; // default 30s if we can't parse
	const match = String(message).match(/(\d+)ms over your limit/);
	if (match) {
		return parseInt(match[1], 10) + 2000; // add 2s buffer
	}
	return 30_000;
}

export async function agilixApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	cmd: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<IDataObject> {
	let lastError: Error | undefined;

	for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
		const { token, baseUrl } = await getToken(this);

		const options: IRequestOptions = {
			method,
			uri: `${baseUrl}/cmd`,
			qs: { cmd, _token: token, ...qs },
			json: true,
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		};

		if (method === 'POST') {
			options.body = { request: { cmd, ...body } };
		}

		try {
			const response = await this.helpers.request(options);
			const parsed = typeof response === 'string' ? JSON.parse(response) : response;

			const resp = parsed?.response;

			// Handle auth failures — force re-login on next try
			if (resp?.code === 'AccessDenied' || resp?.code === 'NotAuthenticated') {
				const creds = await this.getCredentials('agilixBuzzApi');
				const bUrl = ((creds.baseUrl as string) || 'https://api.agilixbuzz.com').replace(/\/+$/, '');
				const key = cacheKey(bUrl, creds.domain as string, creds.username as string);
				sessionCache.delete(key);

				if (attempt < MAX_RETRIES) {
					await sleep(INITIAL_BACKOFF_MS * Math.pow(2, attempt));
					continue;
				}
			}

			// Handle time limiting (API processing budget exceeded)
			if (resp?.code === 'TimeLimit') {
				const retryDelay = parseTimeLimitDelay(resp.message as string);
				if (attempt < MAX_RETRIES && retryDelay <= MAX_TIME_LIMIT_WAIT_MS) {
					await sleep(retryDelay);
					continue;
				}
				throw new NodeApiError(this.getNode(), parsed as JsonObject, {
					message: `Agilix API time limit exceeded (need to wait ~${Math.ceil(retryDelay / 1000)}s). ${resp.message || 'Please try again later.'}`,
				});
			}

			// Handle rate limiting (HTTP 429 or Buzz-specific throttle)
			if (resp?.code === 'TooManyRequests' || resp?.code === 'Throttled') {
				if (attempt < MAX_RETRIES) {
					const backoff = INITIAL_BACKOFF_MS * Math.pow(2, attempt);
					await sleep(backoff);
					continue;
				}
			}

			if (resp && resp.code !== 'OK') {
				throw new NodeApiError(this.getNode(), parsed as JsonObject, {
					message: `Agilix API error: ${resp.code} - ${resp.message || ''}`,
				});
			}

			return parsed as IDataObject;
		} catch (error) {
			lastError = error as Error;

			// Retry on network / transient errors
			if (
				attempt < MAX_RETRIES &&
				(error as NodeApiError).httpCode &&
				[429, 500, 502, 503, 504].includes(Number((error as NodeApiError).httpCode))
			) {
				let backoff = INITIAL_BACKOFF_MS * Math.pow(2, attempt);

				// For HTTP 429, try to parse TimeLimit delay from the error message
				if (Number((error as NodeApiError).httpCode) === 429) {
					const errMsg = String((error as Error).message || '');
					const timeLimitMatch = errMsg.match(/(\d+)ms over your limit/);
					if (timeLimitMatch) {
						const parsedDelay = parseInt(timeLimitMatch[1], 10) + 2000;
						if (parsedDelay > MAX_TIME_LIMIT_WAIT_MS) {
							throw error; // Wait too long, fail fast with clear message
						}
						backoff = parsedDelay;
					}
				}

				await sleep(backoff);
				continue;
			}

			throw error;
		}
	}

	throw lastError ?? new Error('Max retries exceeded');
}

// ── Bulk POST helper (for commands that accept arrays of items) ──────────────
export async function agilixApiBulkRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	cmd: string,
	items: IDataObject[],
	itemTag: string = 'item',
	queryParams: IDataObject = {},
): Promise<IDataObject> {
	const { token, baseUrl } = await getToken(this);

	const requestBody: IDataObject = {
		cmd,
		[itemTag]: items.length === 1 ? items[0] : items,
	};

	const options: IRequestOptions = {
		method: 'POST' as IHttpRequestMethods,
		uri: `${baseUrl}/cmd`,
		qs: { cmd, _token: token, ...queryParams },
		body: { request: requestBody },
		json: true,
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	};

	let lastError: Error | undefined;

	for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
		try {
			const response = await this.helpers.request(options);
			const parsed = typeof response === 'string' ? JSON.parse(response) : response;

			const resp = parsed?.response;

			// Handle time limiting (API processing budget exceeded)
			if (resp?.code === 'TimeLimit') {
				const retryDelay = parseTimeLimitDelay(resp.message as string);
				if (attempt < MAX_RETRIES && retryDelay <= MAX_TIME_LIMIT_WAIT_MS) {
					await sleep(retryDelay);
					continue;
				}
				throw new NodeApiError(this.getNode(), parsed as JsonObject, {
					message: `Agilix API time limit exceeded (need to wait ~${Math.ceil(retryDelay / 1000)}s). ${resp.message || 'Please try again later.'}`,
				});
			}

			if (resp?.code === 'TooManyRequests' || resp?.code === 'Throttled') {
				if (attempt < MAX_RETRIES) {
					await sleep(INITIAL_BACKOFF_MS * Math.pow(2, attempt));
					continue;
				}
			}

			if (resp?.code === 'AccessDenied' || resp?.code === 'NotAuthenticated') {
				const creds = await this.getCredentials('agilixBuzzApi');
				const bUrl = ((creds.baseUrl as string) || 'https://api.agilixbuzz.com').replace(/\/+$/, '');
				const key = cacheKey(bUrl, creds.domain as string, creds.username as string);
				sessionCache.delete(key);

				// Refresh token for retry
				const freshToken = await getToken(this);
				options.qs = { cmd, _token: freshToken.token, ...queryParams };

				if (attempt < MAX_RETRIES) {
					await sleep(INITIAL_BACKOFF_MS * Math.pow(2, attempt));
					continue;
				}
			}

			if (resp && resp.code !== 'OK') {
				throw new NodeApiError(this.getNode(), parsed as JsonObject, {
					message: `Agilix API error: ${resp.code} - ${resp.message || ''}`,
				});
			}

			return parsed as IDataObject;
		} catch (error) {
			lastError = error as Error;

			if (
				attempt < MAX_RETRIES &&
				(error as NodeApiError).httpCode &&
				[429, 500, 502, 503, 504].includes(Number((error as NodeApiError).httpCode))
			) {
				let backoff = INITIAL_BACKOFF_MS * Math.pow(2, attempt);

				// For HTTP 429, try to parse TimeLimit delay from the error message
				if (Number((error as NodeApiError).httpCode) === 429) {
					const errMsg = String((error as Error).message || '');
					const timeLimitMatch = errMsg.match(/(\d+)ms over your limit/);
					if (timeLimitMatch) {
						const parsedDelay = parseInt(timeLimitMatch[1], 10) + 2000;
						if (parsedDelay > MAX_TIME_LIMIT_WAIT_MS) {
							throw error;
						}
						backoff = parsedDelay;
					}
				}

				await sleep(backoff);
				continue;
			}

			throw error;
		}
	}

	throw lastError ?? new Error('Max retries exceeded');
}

// ── Paginated request helper ─────────────────────────────────────────────────
export async function agilixApiRequestAllItems(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	cmd: string,
	resultKey: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	limit?: number,
): Promise<IDataObject[]> {
	const allItems: IDataObject[] = [];
	const pageSize = 100;
	let show = 0;

	qs.limit = String(pageSize);

	do {
		qs.show = String(show);

		const response = await agilixApiRequest.call(this, method, cmd, body, qs);
		const resp = response.response as IDataObject;

		let items = resp?.[resultKey];
		if (!items) break;

		if (!Array.isArray(items)) {
			items = [items];
		}

		allItems.push(...(items as IDataObject[]));

		// If we got fewer items than the page size, we've reached the end
		if ((items as IDataObject[]).length < pageSize) break;

		show += pageSize;

		if (limit && allItems.length >= limit) {
			return allItems.slice(0, limit);
		}
	} while (true);

	if (limit) {
		return allItems.slice(0, limit);
	}

	return allItems;
}
