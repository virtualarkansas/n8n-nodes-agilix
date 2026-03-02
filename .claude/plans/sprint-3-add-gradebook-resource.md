# Sprint 3: Add Gradebook Resource

## Goal
Add a new Gradebook resource with 8 operations covering all gradebook-related API commands.

## Files Modified
- `nodes/AgilixBuzz/descriptions/GradebookDescription.ts` — **NEW**
- `nodes/AgilixBuzz/descriptions/index.ts` — Add Gradebook exports
- `nodes/AgilixBuzz/AgilixBuzz.node.ts` — Add `gradebook` resource option + execute logic

## Operations

### 1. getEnrollmentGradebook
- **API:** `getenrollmentgradebook2` (GET)
- **Required:** `enrollmentid`
- **Optional:** `itemid` (pipe-separated or `*`/`**`), `zerounscored` (bool), `forcerequireditems` (bool), `gradingschemeid`, `gradingscheme`, `scorm` (bool)
- **Response:** `response.enrollment` (single object with `grades` sub-object)

### 2. getEntityGradebook
- **API:** `getentitygradebook3` (GET)
- **Required:** `entityid`
- **Optional:** `enrollmentids` (pipe-separated), `itemid`, `allstatus` (bool), `userid`, `zerounscored` (bool), `forcerequireditems` (bool), `gradingschemeid`, `gradingscheme`, `select`, `scorm` (bool)
- **Response:** `response.enrollments.enrollment` (array)

### 3. getUserGradebook
- **API:** `getusergradebook2` (GET)
- **Required:** `userid`
- **Optional:** `entityid`, `itemid`, `allstatus` (bool), `zerounscored` (bool), `forcerequireditems` (bool), `gradingschemeid`, `gradingscheme`, `scorm` (bool)
- **Response:** `response.enrollments.enrollment` (array)

### 4. getGrade
- **API:** `getgrade` (GET)
- **Required:** `enrollmentid`, `itemid`
- **Response:** `response.grade` (single object)

### 5. getGradeHistory
- **API:** `getgradehistory` (GET)
- **Required:** `enrollmentid`, `itemid`
- **Response:** `response.grades.grade` (array)

### 6. getGradebookList
- **API:** `getgradebooklist` (GET)
- **Required:** (none)
- **Optional:** `title` (wildcard `*` supported), `reference`, `domainid`
- **Response:** `response.gradebooks.gradebook` (array)

### 7. getGradebookWeights
- **API:** `getgradebookweights` (GET)
- **Required:** `entityid`
- **Optional:** `periodid`
- **Response:** `response.weights` (single object with `category` array)

### 8. getGradebookSummary
- **API:** `getentitygradebooksummary` (GET)
- **Required:** `entityid`
- **Optional:** `allstatus` (bool), `enrollmentids` (pipe-separated), `itemid`, `userid`, `zerounscored` (bool), `forcerequireditems` (bool), `daysactivepastend` (int), `gradingschemeid`, `gradingscheme`
- **Response:** `response.summary` (single object)

## Execute Logic Pattern
All operations use GET with query string params only:
```typescript
case 'getEnrollmentGradebook': {
    const qs: IDataObject = {
        enrollmentid: this.getNodeParameter('enrollmentid', i) as string,
    };
    // Add optional params...
    const boolParams = ['zerounscored', 'forcerequireditems', 'scorm'];
    for (const p of boolParams) {
        const val = this.getNodeParameter(p, i, undefined) as boolean | undefined;
        if (val !== undefined) qs[p] = String(val);
    }
    const response = await agilixApiRequest.call(this, 'GET', 'getenrollmentgradebook2', {}, qs);
    responseData = (response.response as IDataObject)?.enrollment || {};
    break;
}
```

## Verification
- All 8 operations appear in node UI when Gradebook resource is selected
- `npm run build` compiles clean
