# Sprint 1: Fix Core Infrastructure (GenericFunctions.ts)

## Goal
Fix all request-level bugs so every API call works correctly.

## File
`nodes/AgilixBuzz/GenericFunctions.ts` — Complete rewrite

## Changes

### 1. Switch login2 → login3
- Change `cmd: 'login2'` to `cmd: 'login3'`
- Add `expireseconds: '3600'` to login body (1 hour sessions)
- Parse `authenticationexpirationminutes` from response instead of hardcoding 15 minutes
- Use actual expiration for session cache

### 2. Fix agilixApiBulkRequest body format
**Current (wrong):**
```json
{ "request": { "cmd": "createenrollments", "enrollment": [{ ... }] } }
```

**Correct (per API docs):**
```json
{ "requests": { "enrollment": [{ ... }] } }
```

- Change body key from `request` to `requests`
- Remove `cmd` from body (it's only needed in query string `qs`)
- Always send items as array (remove `items.length === 1 ? items[0] : items`)
- Refresh token on every retry iteration (currently only refreshes for auth failures)

### 3. Remove agilixApiRequestAllItems
The current paginated helper uses `qs.show = offset` which:
- Conflicts with the real API `show` parameter (`current|deleted|active|all`)
- Is wrong — the API doesn't support offset-based pagination; it uses cursor-based (`/id>{lastId}`)

**Replacement:** Use `limit=0` for "return all" (API supports this natively). For user-specified limits, just pass `limit=N`. No helper function needed.

### 4. Add User-Agent header
Add `'User-Agent': 'n8n-nodes-agilix/0.2.0'` to all request headers (API docs require a unique User-Agent identifying the integration).

### 5. Keep TimeLimit retry handling
The TimeLimit handling added in v0.1.1 is correct — keep it as-is.

### 6. ExtendSession format
Change from GET to POST per API docs:
```json
{ "request": { "cmd": "extendsession" } }
```

## Verification
- File compiles with no TypeScript errors (checked via `npm run build`)
- Login uses `login3` command
- Bulk requests use `{ "requests": { ... } }` format
- No more `agilixApiRequestAllItems` function
