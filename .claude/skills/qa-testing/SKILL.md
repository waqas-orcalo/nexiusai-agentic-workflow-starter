# Skill: qa-testing

## Purpose
Test a completed frontend + backend implementation and generate a structured QA report.
Run after both dev agents have finished their work.

## When to Use
- User says "test this feature", "run QA", "verify the implementation"
- `run-workflow` invokes this after PARALLEL_DEV step completes
- User wants to verify a specific feature before merging

## Always Read First
1. `agents/qa-agent/AGENT.md` — testing rules and bug severity levels
2. `agents/qa-agent/prompts/system.prompt.ts` — QA system prompt
3. `agents/qa-agent/prompts/testing.prompt.ts` — phase-specific test prompts

## Required Inputs
Before starting, confirm you have:
- Feature name (e.g. "Product")
- Backend endpoints to test (from backend agent report or user input)
- Frontend components to test (from frontend agent report or user input)
- Acceptance criteria from the Jira ticket

## Phase 1 — Backend API Tests

For each endpoint, test the following scenarios. Report each as ✅ PASS or ❌ FAIL.

### POST /api/v1/<feature>
- ✅ Valid payload + valid JWT → 201 + `{ success: true, message, data }`
- ✅ No JWT token → 401 Unauthorized
- ✅ Invalid JWT → 401 Unauthorized
- ✅ Empty body `{}` → 400 with validation errors
- ✅ Unknown extra fields → 400 (forbidNonWhitelisted)
- ✅ Response shape: `{ success: true, message: "...", data: { _id, title, ... } }`

### GET /api/v1/<feature>
- ✅ Valid JWT → 200 + `{ success: true, data: [], meta: { total, page, limit, totalPages } }`
- ✅ No JWT → 401
- ✅ `?page=1&limit=5` query params work correctly
- ✅ Deleted items NOT in list (isDeleted filter works)

### GET /api/v1/<feature>/:id
- ✅ Valid ID → 200 + `{ data: { ... } }`
- ✅ Nonexistent ID (valid ObjectId format) → 404
- ✅ Invalid ObjectId format → 400 or 404

### PATCH /api/v1/<feature>/:id
- ✅ Valid partial update → 200 + updated fields reflected
- ✅ Invalid ID → 404
- ✅ No body → 200 (PartialType makes all fields optional)

### DELETE /api/v1/<feature>/:id
- ✅ Valid ID → 200 + `{ data: null }`
- ✅ Item absent from GET /api/v1/<feature> after delete
- ✅ GET /api/v1/<feature>/:id returns 404 after delete
- ✅ Database record has `isDeleted: true` (not physically deleted)
- ✅ Invalid ID → 404

## Phase 2 — Frontend Component Tests

### <Feature>Card
- ✅ Renders with valid `item` prop (title, status visible)
- ✅ `onEdit` and `onDelete` buttons are present and clickable
- ✅ Status chip shows correct color per status enum value

### <Feature>List
- ✅ Shows loading skeleton/spinner when `isLoading: true`
- ✅ Shows error message when `isError: true`
- ✅ Shows empty state when `data: []`
- ✅ Renders `<Feature>Card` for each item when data is present
- ✅ Uses `useGet<Feature>sQuery` (not raw fetch)

### <Feature>Form
- ✅ Renders form fields for all required fields
- ✅ Required field validation triggers on submit with empty fields
- ✅ Shows error messages under each invalid field
- ✅ Submit button is disabled during mutation loading
- ✅ Success: shows toast/snackbar notification
- ✅ Error: shows error message from API

### <Feature>Modal
- ✅ Dialog opens when `open={true}`
- ✅ Dialog closes on backdrop click or Cancel button
- ✅ Renders `<Feature>Form` inside

### Page
- ✅ Page renders without errors
- ✅ "Add <Feature>" button opens modal
- ✅ Edit action in Card opens modal with pre-filled form
- ✅ Page is accessible at `/dashboard/<feature>`

## Phase 3 — Integration Tests

### Flow 1: Create → List
1. POST new item via API / form
2. GET list via frontend
3. ✅ New item appears in list

### Flow 2: Update → Refresh
1. PATCH existing item
2. View list
3. ✅ Updated values shown

### Flow 3: Delete → Removal
1. DELETE item
2. View list
3. ✅ Item not in list

### Flow 4: Auth Guard
1. Navigate to `/dashboard/<feature>` without signing in
2. ✅ Redirected to `/auth/login`
3. Sign in → ✅ Redirected back to feature page

## Phase 4 — Acceptance Criteria

For each criterion from the Jira ticket:
```
AC1: <criterion>
Status: PASS | FAIL
Test: <what was tested>
Evidence: <actual behavior observed>
Bug: <BUG-ID or N/A>
```

## Bug Report Format
For each failure, create:
```json
{
  "bugId": "BUG-001",
  "severity": "CRITICAL | HIGH | MEDIUM | LOW",
  "location": "BACKEND | FRONTEND | INTEGRATION",
  "title": "Short title",
  "steps": ["Step 1", "Step 2"],
  "expected": "Expected behavior",
  "actual": "Actual behavior",
  "endpoint": "POST /api/v1/feature (if backend)"
}
```

**Severity guide:**
- CRITICAL: Auth bypass, data loss, system crash
- HIGH: Core feature broken, acceptance criteria fail
- MEDIUM: Feature works incorrectly in some cases
- LOW: Cosmetic or minor UX issue

## Overall Status Rules
- **PASS:** All tests pass, zero CRITICAL/HIGH bugs
- **PARTIAL:** Minor bugs exist but core functionality works (only LOW/MEDIUM)
- **FAIL:** Any CRITICAL or HIGH bug exists

## Output Report Format

```
QA TESTING REPORT
=================
Feature: <name>
Overall Status: PASS ✅ | FAIL ❌ | PARTIAL ⚠️
Tests Passed: X
Tests Failed: Y
Bugs Found: N

BACKEND TESTS
=============
✅ POST /api/v1/<feature> — 201 correct shape
✅ GET  /api/v1/<feature> — 200 with pagination
✅ GET  /api/v1/<feature>/:id — 200 or 404
✅ PATCH /api/v1/<feature>/:id — 200 updated
✅ DELETE /api/v1/<feature>/:id — soft delete verified
✅ Auth: 401 without token
✅ Validation: 400 on empty body
❌ <failing test> → BUG-001

FRONTEND TESTS
==============
✅ <Feature>Card renders
✅ <Feature>List loading/error/empty states
✅ <Feature>Form validation and submit
✅ <Feature>Modal opens/closes
❌ <failing test> → BUG-002

INTEGRATION TESTS
=================
✅ Create → appears in list
✅ Update → list refreshes
✅ Delete → removed from list
✅ Auth guard redirects unauthenticated users

ACCEPTANCE CRITERIA
===================
✅ AC1: <criterion> — PASS
❌ AC2: <criterion> — FAIL (BUG-001)

BUG REPORTS
===========
[BUG-001][HIGH][BACKEND]
<details>

RECOMMENDATIONS
===============
- <actionable fix instructions for dev agents>
```
