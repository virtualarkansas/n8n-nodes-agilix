# Agilix Buzz n8n Nodes — Full Redesign Plan (v1)

## Context

The n8n-nodes-agilix package was built without access to the official Agilix Buzz API documentation. Now that the full docs have been scraped to https://github.com/virtualarkansas/agilix-buzz-api-docs, we can fix all incorrect implementations and add proper coverage of the API.

## Gap Analysis Summary

### Critical Bugs
1. **`login2` is obsolete** — Must switch to `login3` which adds `expireseconds`, `newsession`, returns `authenticationexpirationminutes`
2. **Batch request format is wrong** — API expects `{ "requests": { "<type>": [...] } }` but code sends `{ "request": { "cmd": "...", "<type>": [...] } }`
3. **`show` parameter conflicts with pagination** — `agilixApiRequestAllItems` uses `qs.show` as pagination offset, but `show` is actually `current|deleted|active|all` filter. API uses cursor-based pagination (ID > lastId), not offset-based.
4. **Password in GET query string** — `updatePassword` sends password as query param (logged by proxies/servers)
5. **Fabricated commands** — `echo`, `getuploadlimits`, `getcoursehistory`, `createlibrarypage`, `getlibrarypage`, `listlibrarypages` don't exist in the API
6. **Token refresh bug in bulk requests** — `agilixApiBulkRequest` gets token once; doesn't refresh on non-auth retries
7. **Single item unwrapping** — `items.length === 1 ? items[0] : items` — API always expects arrays for batch commands
8. **Proxy/Unproxy use GET** — Docs specify POST for both
9. **SendMail body format wrong** — API expects `{ "email": { "enrollments": { "enrollment": [...] }, "subject": { "$value": "..." }, "body": { "$value": "..." } } }` with `enrollmentid` on query string
10. **Boolean inconsistency** — Some booleans converted to strings, most sent as raw JS booleans. API expects string `"true"`/`"false"` in query strings.

### Missing API Coverage
- Gradebook (12+ commands)
- Items/Manifest (8+ commands)
- Submissions (8+ commands)
- Assessments (6+ commands)
- Announcements, Groups, Messages, Wikis, Blogs, Badges, Objectives

### Existing Resources (10)
User (11 ops), Course (11 ops), Enrollment (14 ops), Domain (11 ops), Authentication (11 ops), Right (16 ops), Resource (9 ops), Report (4 ops), General (6 ops), Library (3 ops — FAKE)

### Files Involved
- `nodes/AgilixBuzz/GenericFunctions.ts` — Core request infrastructure
- `nodes/AgilixBuzz/AgilixBuzz.node.ts` — Main node execute function
- `nodes/AgilixBuzz/descriptions/*.ts` — 10 existing + 3 new description files
- `nodes/AgilixBuzz/descriptions/index.ts` — Description exports

---

## Sprint Plan

### Sprint 1: Fix Core Infrastructure (GenericFunctions.ts)
**Goal:** Fix all request-level bugs so every API call works correctly.

**Changes:**
1. Switch `login2` → `login3` with `expireseconds: '3600'`
2. Use `authenticationexpirationminutes` from login response for session expiry
3. Fix `agilixApiBulkRequest`:
   - Change body from `{ request: { cmd, [tag]: items } }` to `{ requests: { [tag]: items } }`
   - Always send arrays (remove single-item unwrapping)
   - Refresh token on every retry (like `agilixApiRequest` does)
4. Remove `agilixApiRequestAllItems` — API pagination is cursor-based, not offset-based. Use `limit=0` for "return all" instead.
5. Add `User-Agent: n8n-nodes-agilix/0.2.0` header to all requests
6. Keep TimeLimit handling from v0.1.1

**File:** `nodes/AgilixBuzz/GenericFunctions.ts`

---

### Sprint 2: Fix Existing Resources (Descriptions + Node Logic)
**Goal:** Fix all parameter/format issues in existing resources.

**Changes per resource:**

**General** — Remove `echo` and `getUploadLimits` (fake). Keep: getCommandList, getEntityType, getStatus, sendMail.
- Fix sendMail to use correct body format with `enrollmentid` on query string

**Authentication** — Fix `proxy`/`unproxy` to use POST. Fix `updatePassword` to send password in POST body.
- Keep getPasswordPolicy (IS real, just missing from command index)

**Course** — Remove `getCourseHistory` (fake; use `select=history(...)` on getCourse2). Remove `show` field from additional fields on list (conflicts with pagination → now we use `limit` param directly).

**User** — Fix boolean params to string conversion. Adjust list operation to use `limit` param directly instead of broken pagination.

**Enrollment** — Same pagination fix. Fix `show` field. Ensure `disallowduplicates` sent as query param not body.

**Domain** — Minor fixes. Pagination fix.

**Right** — Fix `updateRights` bulk format (currently uses `agilixApiBulkRequest`).

**Resource** — Minor fixes.

**Report** — Fix `AsOf` casing if needed.

**Library** — DELETE entirely (fake commands).

**Files:**
- `nodes/AgilixBuzz/descriptions/GeneralDescription.ts`
- `nodes/AgilixBuzz/descriptions/AuthenticationDescription.ts`
- `nodes/AgilixBuzz/descriptions/CourseDescription.ts`
- `nodes/AgilixBuzz/descriptions/UserDescription.ts`
- `nodes/AgilixBuzz/descriptions/EnrollmentDescription.ts`
- `nodes/AgilixBuzz/descriptions/DomainDescription.ts`
- `nodes/AgilixBuzz/descriptions/RightDescription.ts`
- `nodes/AgilixBuzz/descriptions/ResourceDescription.ts`
- `nodes/AgilixBuzz/descriptions/ReportDescription.ts`
- `nodes/AgilixBuzz/descriptions/LibraryDescription.ts` (DELETE)
- `nodes/AgilixBuzz/AgilixBuzz.node.ts` (execute function updates)
- `nodes/AgilixBuzz/descriptions/index.ts` (remove Library exports)

---

### Sprint 3: Add Gradebook Resource
**Goal:** Add the most important missing resource for LMS integrations.

**Operations:**
1. `getEnrollmentGradebook` → `getenrollmentgradebook2` (GET) — Single enrollment grades
2. `getEntityGradebook` → `getentitygradebook3` (GET) — All student grades in a course
3. `getUserGradebook` → `getusergradebook2` (GET) — All enrollment grades for a user
4. `getGrade` → `getgrade` (GET) — Single item grade
5. `getGradeHistory` → `getgradehistory` (GET) — Grade change history
6. `getGradebookList` → `getgradebooklist` (GET) — List courses with gradebooks
7. `getGradebookWeights` → `getgradebookweights` (GET) — Category/item weights
8. `getGradebookSummary` → `getentitygradebooksummary` (GET) — Aggregated class grades
9. `calculateScenario` → `calculateenrollmentscenario` (POST bulk) — What-if grades

**Files:**
- `nodes/AgilixBuzz/descriptions/GradebookDescription.ts` (NEW)
- `nodes/AgilixBuzz/descriptions/index.ts` (add exports)
- `nodes/AgilixBuzz/AgilixBuzz.node.ts` (add gradebook operations)

---

### Sprint 4: Add Item Resource
**Goal:** Add course content/manifest item management.

**Operations:**
1. `list` → `getitemlist` (GET) — List items in a course
2. `get` → `getitem` (GET) — Get single item
3. `getInfo` → `getiteminfo` (POST bulk) — Get item metadata
4. `create` → `putitems` (POST bulk) — Create/update items
5. `delete` → `deleteitems` (POST bulk) — Delete items
6. `restore` → `restoreitems` (POST bulk) — Restore deleted items
7. `copy` → `copyitems` (POST bulk) — Copy items between courses
8. `assign` → `assignitem` (POST query) — Assign item to folder
9. `unassign` → `unassignitem` (POST query) — Unassign item

**Files:**
- `nodes/AgilixBuzz/descriptions/ItemDescription.ts` (NEW)
- `nodes/AgilixBuzz/descriptions/index.ts`
- `nodes/AgilixBuzz/AgilixBuzz.node.ts`

---

### Sprint 5: Add Submission Resource
**Goal:** Add student submission and teacher response management.

**Operations:**
1. `getStudentSubmission` → `getstudentsubmission` (GET) — Get submission data
2. `getStudentSubmissionHistory` → `getstudentsubmissionhistory` (GET) — Submission history
3. `getStudentSubmissionInfo` → `getstudentsubmissioninfo` (POST bulk) — Submission version info
4. `putStudentSubmission` → `putstudentsubmission` (POST) — Submit student work
5. `getTeacherResponse` → `getteacherresponse` (GET) — Get teacher feedback
6. `putTeacherResponses` → `putteacherresponses` (POST bulk) — Batch grade/score
7. `getSubmissionState` → `getsubmissionstate` (GET) — Can student start/retake?
8. `getAttemptReview` → `getattemptreview` (GET) — Review completed assessment

**Files:**
- `nodes/AgilixBuzz/descriptions/SubmissionDescription.ts` (NEW)
- `nodes/AgilixBuzz/descriptions/index.ts`
- `nodes/AgilixBuzz/AgilixBuzz.node.ts`

---

### Sprint 6: Build, Test, Publish
**Goal:** Version bump, build, push, publish.

1. Bump version to `0.2.0`
2. `npm run build` — verify TypeScript compiles
3. Commit all changes
4. Push to branch
5. `npm publish`

---

## Verification
- `npm run build` must succeed with no TypeScript errors
- Manual verification: the node should load in n8n without errors
- API calls should use `login3` (verify in request logs)
- Batch operations should send `{ "requests": { ... } }` format
