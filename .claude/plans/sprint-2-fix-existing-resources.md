# Sprint 2: Fix Existing Resources

## Goal
Fix all parameter/format issues in existing resources and remove fabricated commands.

## Files Modified
- `nodes/AgilixBuzz/descriptions/GeneralDescription.ts`
- `nodes/AgilixBuzz/descriptions/AuthenticationDescription.ts`
- `nodes/AgilixBuzz/descriptions/CourseDescription.ts`
- `nodes/AgilixBuzz/descriptions/UserDescription.ts`
- `nodes/AgilixBuzz/descriptions/EnrollmentDescription.ts`
- `nodes/AgilixBuzz/descriptions/DomainDescription.ts`
- `nodes/AgilixBuzz/descriptions/RightDescription.ts`
- `nodes/AgilixBuzz/descriptions/ResourceDescription.ts`
- `nodes/AgilixBuzz/descriptions/ReportDescription.ts`
- `nodes/AgilixBuzz/descriptions/LibraryDescription.ts` — **DELETE**
- `nodes/AgilixBuzz/descriptions/index.ts` — Remove Library exports
- `nodes/AgilixBuzz/AgilixBuzz.node.ts` — Update execute function

## Changes by Resource

### General
- **Remove** `echo` operation (not a real API command)
- **Remove** `getUploadLimits` operation (not a real API command)
- **Fix** `sendMail`: API expects `enrollmentid` as query param (sender's enrollment) and body as:
  ```json
  { "email": { "enrollments": { "enrollment": [{ "id": "recipientEnrollmentId" }] }, "subject": { "$value": "..." }, "body": { "$value": "..." } } }
  ```
  Current code sends flat fields. Need special handling in execute function (not `agilixApiRequest`).

### Authentication
- **Fix** `proxy`: Change from GET to POST. Body: `{ "request": { "cmd": "proxy", "userid": "..." } }`
- **Fix** `unproxy`: Change from GET to POST. Body: `{ "request": { "cmd": "unproxy" } }`. Remove `userid` parameter (not needed — session knows who is proxied).
- **Fix** `updatePassword`: Change from GET to POST. Move `password` from query string to POST body for security.
- **Keep** `getPasswordPolicy` — it IS real (referenced in Command Usage doc as an auth-free command, just missing from command index)

### Course
- **Remove** `getCourseHistory` operation (not a real command; history is retrieved via `select=history(...)` on `getcourse2`)
- **Remove** `show` from additional fields on `list` operation (was conflicting with pagination; `show` is actually `current|deleted|active|all`)
- **Add** `show` as a proper dropdown option field (current/deleted/active/all) on `list` operation
- **Fix** `list`: Replace `agilixApiRequestAllItems` call with direct `agilixApiRequest` using `limit` param. Add `returnAll` toggle.

### User
- **Fix** `list`: Same pagination fix — use `limit` param directly
- **Fix** boolean params (`includedescendantdomains`, `byday`, `bymonth`, `byyear`) to convert to strings via `String(value)`

### Enrollment
- **Fix** `list`: Same pagination fix
- **Fix** `create`: Ensure `disallowduplicates` stays as query param (currently correct but verify)
- **Fix** boolean params to string conversion
- **Add** proper `show` dropdown on `list` operation

### Domain
- **Fix** `list`: Same pagination fix
- **Fix** `getContent`: Per API docs, no parameters needed (uses current user's domain). Remove `domainid` as required param.
- **Fix** boolean params

### Right
- **Fix** `updateRights` bulk format (will automatically use new `agilixApiBulkRequest` format)
- Verify all operations work with new request format

### Resource
- Minor: verify `getresourceinfo2` POST format is correct with new bulk helper

### Report
- **Fix** `AsOf` field — API docs don't clarify casing. Keep as-is but verify.
- Minor fixes

### Library — DELETE
- Delete `LibraryDescription.ts` entirely
- Remove all Library imports/exports from `index.ts`
- Remove Library execute block from `AgilixBuzz.node.ts`
- Remove `library` from resource options in the node

## Key Pattern: Pagination Fix
For every "list" operation that previously used `agilixApiRequestAllItems`:

**Before:**
```typescript
if (returnAll) {
    responseData = await agilixApiRequestAllItems.call(this, 'GET', 'listusers', 'user', {}, qs);
} else {
    qs.limit = this.getNodeParameter('limit', i);
    const response = await agilixApiRequest.call(this, 'GET', 'listusers', {}, qs);
    responseData = response.response?.users?.user || [];
}
```

**After:**
```typescript
if (returnAll) {
    qs.limit = '0';
} else {
    qs.limit = String(this.getNodeParameter('limit', i));
}
const response = await agilixApiRequest.call(this, 'GET', 'listusers', {}, qs);
const resp = response.response as IDataObject;
let items = (resp?.users as IDataObject)?.user;
if (!items) items = [];
if (!Array.isArray(items)) items = [items];
responseData = items;
```

## Verification
- All removed operations no longer appear in node UI
- Library resource completely gone
- `npm run build` compiles clean
- Proxy/unproxy use POST
- UpdatePassword sends password in body
