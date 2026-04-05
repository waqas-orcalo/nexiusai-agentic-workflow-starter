// ─────────────────────────────────────────────────────────────────────────────
//  QA Agent — Testing Prompt Templates
//  Specific prompts for each testing phase
// ─────────────────────────────────────────────────────────────────────────────

// ─── Backend Endpoint Test Prompt ─────────────────────────────────────────────
export const buildBackendTestPrompt = (
  featureName: string,
  endpoint: string,
  method: string,
  baseUrl = 'http://localhost:3001',
): string => `
Test the following backend endpoint for the "${featureName}" feature:

Endpoint: ${method} ${baseUrl}${endpoint}
Base URL: ${baseUrl}

## Test Suite to Execute

### 1. Happy Path Test
- Request: ${method} ${baseUrl}${endpoint} with valid payload and valid JWT token
- Expected:
  - Status: ${method === 'POST' ? '201' : '200'}
  - Body: { "success": true, "message": "...", "data": {...} }
  - Response time: < 500ms

### 2. Authentication Test
- Request: ${method} ${baseUrl}${endpoint} WITHOUT Authorization header
- Expected: Status 401 Unauthorized

### 3. Validation Test (for POST/PATCH only)
${['POST', 'PATCH'].includes(method)
  ? `- Request: ${method} ${baseUrl}${endpoint} with empty body {}`
    + `\n- Expected: Status 400 Bad Request with validation error messages`
  : '- N/A for GET/DELETE'}

### 4. Not Found Test (for /:id endpoints)
${endpoint.includes(':id') || endpoint.includes('{id}')
  ? `- Request: ${method} ${baseUrl}${endpoint.replace(':id', '000000000000000000000000')} (nonexistent ID)`
    + `\n- Expected: Status 404 Not Found`
  : '- N/A for collection endpoints'}

### 5. Response Shape Validation
Verify every response (success or error) follows this shape:
\`\`\`json
{
  "success": true | false,
  "message": "string",
  "data": any | null,
  "meta"?: { "total": number, "page": number, "limit": number, "totalPages": number }
}
\`\`\`

Report each test as PASS or FAIL with evidence (actual status code, actual body).
`.trim();

// ─── Soft Delete Test Prompt ───────────────────────────────────────────────────
export const buildSoftDeleteTestPrompt = (featureName: string, baseUrl = 'http://localhost:3001'): string => `
Verify soft delete is implemented correctly for the "${featureName}" feature.

## Steps

1. Create a new ${featureName}:
   POST ${baseUrl}/api/v1/${featureName.toLowerCase()}
   → Note the returned _id

2. Delete it:
   DELETE ${baseUrl}/api/v1/${featureName.toLowerCase()}/:id
   → Expect: 200 { success: true, data: null }

3. Verify it's gone from the list:
   GET ${baseUrl}/api/v1/${featureName.toLowerCase()}
   → Expect: item is NOT in the data array

4. Verify it's gone from direct lookup:
   GET ${baseUrl}/api/v1/${featureName.toLowerCase()}/:id
   → Expect: 404 Not Found

5. Verify the database record still exists:
   Check MongoDB directly (or use an admin endpoint if available)
   → Expect: record has isDeleted: true, isDeleted is NOT physically deleted

## PASS Criteria
- Steps 1-4 all return expected responses
- Database record shows isDeleted=true (not removed)

## FAIL Criteria
- Item is still in the list after DELETE (isDeleted filter missing)
- GET /:id still returns the deleted item (soft delete not enforced in findById)
- Database record is physically deleted (hard delete used instead of soft delete)
`.trim();

// ─── Frontend Component Test Prompt ───────────────────────────────────────────
export const buildFrontendTestPrompt = (
  componentName: string,
  featureName: string,
): string => `
Test the "${componentName}" component for the "${featureName}" feature.

## Component Location
frontend/src/components/${featureName.toLowerCase()}/${componentName}.tsx

## Tests to Execute

### 1. Render Test
- Mount <${componentName} /> with valid props (or no props if none required)
- Expected: No console errors, no render crashes
- Check: Component root element is visible in the DOM

### 2. Loading State Test
- Mock RTK Query hook to return { isLoading: true }
- Expected: Loading spinner or skeleton is visible
- Check: No actual data content is rendered while loading

### 3. Error State Test
- Mock RTK Query hook to return { isError: true, error: { message: 'Server error' } }
- Expected: Error message is displayed to the user
- Check: Error text visible, no crash

### 4. Data Display Test (for list/card components)
- Mock RTK Query hook to return { data: [mockItem], isLoading: false }
- Expected: Item data is rendered correctly
- Check: Title, description, status fields are visible

### 5. Form Submission Test (for form components)
- Fill in all required fields
- Submit the form
- Expected: RTK Query mutation hook is called with correct payload
- Expected: Success feedback (toast/alert/redirect) appears
- Check: Form resets or navigation occurs after success

### 6. Form Validation Test (for form components)
- Submit form with empty required fields
- Expected: Validation error messages appear under each required field
- Check: Mutation hook is NOT called on invalid submission

Report each test as PASS or FAIL with details.
`.trim();

// ─── Integration Test Prompt ──────────────────────────────────────────────────
export const buildIntegrationTestPrompt = (featureName: string): string => `
Execute end-to-end integration tests for the "${featureName}" feature.

## Environment
- Backend: http://localhost:3001
- Frontend: http://localhost:3000

## Test Flow 1 — Full CRUD Journey
1. Sign in as test user → obtain JWT token
2. Create a new ${featureName} via POST /api/v1/${featureName.toLowerCase()}
3. Navigate to ${featureName} list page in frontend → verify new item appears
4. Click edit on the item → update a field → save
5. Navigate back to list → verify updated value shown
6. Delete the item from the frontend
7. Verify item no longer appears in the list

Expected: All 7 steps complete without error, UI stays in sync with API

## Test Flow 2 — Auth Guard Journey
1. Sign out (clear JWT token)
2. Navigate to protected ${featureName} page directly
3. Expected: Redirected to /auth/login
4. Sign in with valid credentials
5. Expected: Redirected back to original ${featureName} page
6. Expected: Data loads correctly

## Test Flow 3 — Error Handling Journey
1. Disconnect backend (or mock 500 error)
2. Navigate to ${featureName} list
3. Expected: Error message shown in UI, not a blank screen or crash
4. Reconnect backend
5. Refresh page
6. Expected: Data loads correctly

Report each flow as PASS or FAIL with step-by-step observations.
`.trim();

// ─── Acceptance Criteria Test Prompt ─────────────────────────────────────────
export const buildAcceptanceCriteriaTestPrompt = (
  featureName: string,
  criteria: string[],
): string => `
Verify all acceptance criteria for the "${featureName}" feature.

## Acceptance Criteria from Jira Ticket

${criteria.map((ac, i) => `AC${i + 1}: ${ac}`).join('\n')}

## Instructions

For each acceptance criterion above:
1. Identify which part of the system it tests (backend API, frontend UI, or both)
2. Design a specific test scenario that proves or disproves the criterion
3. Execute the test (or describe the exact steps to execute it)
4. Record the result: PASS or FAIL
5. If FAIL: create a bug report with severity and reproduction steps

## Output Format for Each Criterion

AC<N>: <criterion text>
Status: PASS | FAIL
Test Executed: <description of what was tested>
Evidence: <actual result observed>
Bug: <bug ID if failed, or N/A>

Ensure ALL criteria are covered. Missing a criterion counts as FAIL.
`.trim();
