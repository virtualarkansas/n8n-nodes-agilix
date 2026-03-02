# Sprint 5: Add Submission Resource

## Goal
Add a new Submission resource with 7 operations covering student submissions and attempt reviews.

## Files Modified
- `nodes/AgilixBuzz/descriptions/SubmissionDescription.ts` — **NEW**
- `nodes/AgilixBuzz/descriptions/index.ts` — Add Submission exports
- `nodes/AgilixBuzz/AgilixBuzz.node.ts` — Add `submission` resource option + execute logic

## Operations

### 1. getStudentSubmission (GET)
- **API:** `getstudentsubmission`
- **Required:** `enrollmentid`, `itemid`, `packagetype` (dropdown: data/file/zip)
- **Optional:** `version`, `filepath` (when packagetype=file), `inline` (bool)
- **Response:** Binary data — returns file stream, NOT JSON
- **Special handling:** Need to use `encoding: null` and return as n8n binary data

### 2. getStudentSubmissionHistory (GET)
- **API:** `getstudentsubmissionhistory`
- **Required:** `enrollmentid`, `itemid`
- **Response:** `response.submissions.submission` (array)

### 3. getStudentSubmissionInfo (POST bulk)
- **API:** `getstudentsubmissioninfo`
- **Uses:** `agilixApiBulkRequest(this, 'POST', 'getstudentsubmissioninfo', 'submission', [{ enrollmentid, itemid }])`
- **Required:** `enrollmentid`, `itemid`
- **Response:** `response.responses.response` (array with `submission.version`)

### 4. putStudentSubmission (POST)
- **API:** `putstudentsubmission`
- **Required:** `enrollmentid` (QS), `itemid` (QS), `body` (JSON submission data)
- **Optional:** `recordactivity` (bool)
- **Special:** Content-Type: application/json, body is submission JSON directly (NOT bulk wrapper)
- **Response:** `response.submission` (single, contains `version`)

### 5. getSubmissionState (GET)
- **API:** `getsubmissionstate`
- **Required:** `enrollmentid`, `itemid`, `utcoffset` (int, minutes from GMT)
- **Optional:** `createifempty` (bool)
- **Response:** `response.submissionstate` (single object with flags like `canstart`, `canretake`, `cancontinue`)

### 6. getAttemptReview (GET)
- **API:** `getattemptreview`
- **Required:** `enrollmentid`, `itemid`
- **Optional:** `groupid`, `submissionversion`, `responseversion`, `forviewing` (bool)
- **Response:** `response` (attempt data with questions, answers, feedback)

### 7. getAttempt (GET)
- **API:** `getattempt`
- **Required:** `enrollmentid`, `itemid`
- **Optional:** `groupid`, `questionid` (pipe-separated), `password`, `utcoffset` (int)
- **Response:** `response` (attempt data for taking/editing)

## Special Considerations
- `getStudentSubmission` returns binary — needs special binary handling in execute
- `putStudentSubmission` uses direct JSON body, not bulk format
- `getStudentSubmissionInfo` uses bulk format with tag `submission`
- `utcoffset` is minutes from GMT (e.g., -360 for US Central = GMT-6)

## Verification
- All 7 operations appear in node UI when Submission resource is selected
- Binary download works for getStudentSubmission
- `npm run build` compiles clean
