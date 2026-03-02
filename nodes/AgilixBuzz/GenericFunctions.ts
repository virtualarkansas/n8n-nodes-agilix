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

const USER_AGENT = 'n8n-nodes-agilix/0.2.0';

// ── Session cache (shared across executions within the same worker) ──────────
interface SessionInfo {
	token: string;
	expiration: number; // unix ms
	domainId: string;
}

const sessionCache = new Map<string, SessionInfo>();

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
		body: {
			request: {
				cmd: 'login3',
				username: `${domain}/${username}`,
				password,
				expireseconds: '3600',
			},
		},
		json: true,
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			'User-Agent': USER_AGENT,
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

	const expirationMinutes = parseInt(resp.user?.authenticationexpirationminutes as string, 10) || 60;
	const domainId = (resp.user?.domainid as string) || '';

	const session: SessionInfo = {
		token,
		expiration: Date.now() + expirationMinutes * 60 * 1000,
		domainId,
	};

	sessionCache.set(cacheKey(baseUrl, domain, username), session);
	return session;
}

async function extendSession(
	ctx: IExecuteFunctions | ILoadOptionsFunctions,
	baseUrl: string,
	token: string,
): Promise<number> {
	const options: IRequestOptions = {
		method: 'POST' as IHttpRequestMethods,
		uri: `${baseUrl}/cmd`,
		qs: { _token: token },
		body: {
			request: { cmd: 'extendsession' },
		},
		json: true,
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			'User-Agent': USER_AGENT,
		},
	};

	const response = await ctx.helpers.request(options);
	const body = typeof response === 'string' ? JSON.parse(response) : response;
	const resp = body?.response;
	if (!resp || resp.code !== 'OK') {
		throw new Error('extend_session_failed');
	}
	return parseInt(resp.session?.authenticationexpirationminutes as string, 10) || 60;
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

	if (session) {
		try {
			const expirationMinutes = await extendSession(ctx, baseUrl, session.token);
			session.expiration = Date.now() + expirationMinutes * 60 * 1000;
			return { token: session.token, baseUrl };
		} catch {
			// Fall through to full login
		}
	}

	session = await login(ctx, baseUrl, domain, username, password);
	return { token: session.token, baseUrl };
}

function invalidateSession(ctx: IExecuteFunctions | ILoadOptionsFunctions): void {
	ctx.getCredentials('agilixBuzzApi').then((creds) => {
		const bUrl = ((creds.baseUrl as string) || 'https://api.agilixbuzz.com').replace(/\/+$/, '');
		const key = cacheKey(bUrl, creds.domain as string, creds.username as string);
		sessionCache.delete(key);
	}).catch(() => {});
}

export async function getSessionDomainId(
	ctx: IExecuteFunctions | ILoadOptionsFunctions,
): Promise<string> {
	await getToken(ctx);
	const creds = await ctx.getCredentials('agilixBuzzApi');
	const bUrl = ((creds.baseUrl as string) || 'https://api.agilixbuzz.com').replace(/\/+$/, '');
	const key = cacheKey(bUrl, creds.domain as string, creds.username as string);
	return sessionCache.get(key)?.domainId || '';
}

// ── Rate-limit & time-limit aware request helper ─────────────────────────────
const MAX_RETRIES = 5;
const INITIAL_BACKOFF_MS = 1000;
const MAX_TIME_LIMIT_WAIT_MS = 180_000;

async function sleep(ms: number): Promise<void> {
	return new Promise<void>((resolve) => {
		setTimeout(resolve, ms);
	});
}

function parseTimeLimitDelay(message: string | undefined): number {
	if (!message) return 30_000;
	const match = String(message).match(/(\d+)ms over your limit/);
	if (match) {
		return parseInt(match[1], 10) + 2000;
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
				'User-Agent': USER_AGENT,
			},
		};

		if (method === 'POST') {
			options.body = { request: { cmd, ...body } };
		}

		try {
			const response = await this.helpers.request(options);
			const parsed = typeof response === 'string' ? JSON.parse(response) : response;

			const resp = parsed?.response;

			if (resp?.code === 'AccessDenied' || resp?.code === 'NotAuthenticated') {
				invalidateSession(this);
				if (attempt < MAX_RETRIES) {
					await sleep(INITIAL_BACKOFF_MS * Math.pow(2, attempt));
					continue;
				}
			}

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

// ── Bulk POST helper (for commands that accept arrays of items) ──────────────
export async function agilixApiBulkRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	cmd: string,
	items: IDataObject[],
	itemTag: string = 'item',
	queryParams: IDataObject = {},
): Promise<IDataObject> {
	let lastError: Error | undefined;

	for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
		const { token, baseUrl } = await getToken(this);

		const options: IRequestOptions = {
			method: 'POST' as IHttpRequestMethods,
			uri: `${baseUrl}/cmd`,
			qs: { cmd, _token: token, ...queryParams },
			body: { requests: { [itemTag]: items } },
			json: true,
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'User-Agent': USER_AGENT,
			},
		};

		try {
			const response = await this.helpers.request(options);
			const parsed = typeof response === 'string' ? JSON.parse(response) : response;

			const resp = parsed?.response;

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
				invalidateSession(this);
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

// ── Binary request helper (for file/zip downloads) ───────────────────────────
export async function agilixApiRequestBinary(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	cmd: string,
	qs: IDataObject = {},
): Promise<{ body: Buffer; contentType: string; fileName: string }> {
	let lastError: Error | undefined;

	for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
		const { token, baseUrl } = await getToken(this);

		const options: IRequestOptions = {
			method: 'GET' as IHttpRequestMethods,
			uri: `${baseUrl}/cmd`,
			qs: { cmd, _token: token, ...qs },
			encoding: null,
			resolveWithFullResponse: true,
			json: false,
			headers: {
				'User-Agent': USER_AGENT,
			},
		};

		try {
			const response = await this.helpers.request(options);
			const headers = response.headers || {};
			const contentType = (headers['content-type'] as string) || 'application/octet-stream';

			// If JSON came back, the API returned an error instead of binary data
			if (contentType.includes('application/json')) {
				const parsed = JSON.parse(response.body.toString());
				const resp = parsed?.response;

				if (resp?.code === 'AccessDenied' || resp?.code === 'NotAuthenticated') {
					invalidateSession(this);
					if (attempt < MAX_RETRIES) {
						await sleep(INITIAL_BACKOFF_MS * Math.pow(2, attempt));
						continue;
					}
				}

				if (resp?.code === 'TimeLimit') {
					const retryDelay = parseTimeLimitDelay(resp.message as string);
					if (attempt < MAX_RETRIES && retryDelay <= MAX_TIME_LIMIT_WAIT_MS) {
						await sleep(retryDelay);
						continue;
					}
				}

				if (resp?.code === 'TooManyRequests' || resp?.code === 'Throttled') {
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
			}

			// Parse filename from Content-Disposition header
			const disposition = (headers['content-disposition'] as string) || '';
			let fileName = 'submission';
			const filenameMatch = disposition.match(/filename[*]?=(?:UTF-8''|"?)([^";]+)/i);
			if (filenameMatch) {
				fileName = decodeURIComponent(filenameMatch[1].replace(/"/g, ''));
			} else if (qs.packagetype === 'zip') {
				fileName = 'submission.zip';
			}

			const body = Buffer.isBuffer(response.body)
				? response.body
				: Buffer.from(response.body);

			return { body, contentType, fileName };
		} catch (error) {
			lastError = error as Error;

			if (
				attempt < MAX_RETRIES &&
				(error as NodeApiError).httpCode &&
				[429, 500, 502, 503, 504].includes(Number((error as NodeApiError).httpCode))
			) {
				await sleep(INITIAL_BACKOFF_MS * Math.pow(2, attempt));
				continue;
			}

			throw error;
		}
	}

	throw lastError ?? new Error('Max retries exceeded');
}
