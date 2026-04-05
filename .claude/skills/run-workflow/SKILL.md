# Skill: run-workflow

## Purpose
Execute the complete NexusAI 5-step agentic workflow for a given Jira ticket URL.

## When to Use
- User provides a Jira ticket URL and says "run workflow", "build this", "implement this ticket"
- User wants the full automated pipeline: analyze → plan → build → test → report

## Prerequisites
- Both `frontend/` and `backend/` directories exist in the project
- TypeScript environment is set up

## Execution Steps

### Step 1 — Gather Input
Ask the user for:
1. **Jira Ticket URL** (e.g. `https://company.atlassian.net/browse/PROJ-123`)
2. **Your name / email** (for the `triggeredBy` field in the workflow report)

If the user already provided both, skip directly to Step 2.

### Step 2 — Read Agent Files
Before doing anything, read these files in order:
1. `agents/types.ts` — understand all TypeScript interfaces
2. `agents/main-agent/AGENT.md` — orchestration rules
3. `agents/jira-explore-agent/AGENT.md` — ticket analysis rules
4. `agents/frontend-agent/AGENT.md` — frontend implementation rules
5. `agents/backend-agent/AGENT.md` — backend implementation rules
6. `agents/qa-agent/AGENT.md` — QA testing rules

### Step 3 — Execute Step 1: Jira Explore
Act as the `jira-explore-agent`:
1. Fetch the Jira ticket from the provided URL
   - Try Jira REST API v3: `GET https://<domain>/rest/api/3/issue/<ticket-id>`
   - If auth fails or URL is not a real Jira instance, extract info from the URL and ask the user to paste the ticket description
2. Extract and populate a `JiraTicket` object:
   ```typescript
   {
     ticketId, url, title, description,
     acceptanceCriteria: [],
     scope: 'FRONTEND' | 'BACKEND' | 'FULLSTACK',
     designLinks: [],
     apiRequirements: [],
     dependencies: [],
     edgeCases: [],
     priority: 'HIGH' | 'MEDIUM' | 'LOW' | 'CRITICAL'
   }
   ```
3. Show the user a text summary of what was extracted
4. Ask: "Is this analysis correct? Shall I proceed with implementation?" (YES / NO)

### Step 4 — Execute Step 2: Planning
Act as the `main-agent`:
1. Based on `ticket.scope`, determine which agents to invoke:
   - `FRONTEND` → frontend-agent only
   - `BACKEND` → backend-agent only
   - `FULLSTACK` → frontend-agent + backend-agent in parallel
2. Create the `ExecutionPlan` with tasks and parallel groups
3. Show the plan to the user:
   ```
   EXECUTION PLAN
   ==============
   Scope: FULLSTACK
   Tasks:
   • [frontend-agent] Build <feature> UI
   • [backend-agent]  Build <feature> APIs
   ⚡ Running in PARALLEL
   Estimated: 4-6 hours
   Risks: <any risks>
   ```

### Step 5 — Execute Step 3: Parallel Dev
For FULLSTACK scope — act as BOTH agents simultaneously by doing FE and BE tasks:

**Frontend Agent tasks** (in `frontend/`):
- Read `agents/frontend-agent/AGENT.md` for exact patterns
- Create RTK Query service (`frontend/src/services/<feature>Api.ts`)
- Create Redux slice (`frontend/src/store/slices/<feature>Slice.ts`)
- Create components in `frontend/src/components/<feature>/`
- Create page in `frontend/src/app/(dashboard)/<feature>/page.tsx`

**Backend Agent tasks** (in `backend/`):
- Read `agents/backend-agent/AGENT.md` for exact patterns
- Update enums and messages constants
- Create schema, repository, DTOs, service, controller, module
- Register module in `backend/src/app.module.ts`

Show progress updates as each file is created.

### Step 6 — Execute Step 4: QA Testing
Act as the `qa-agent`:
1. Read `agents/qa-agent/AGENT.md` for testing rules
2. Run all 4 test phases (backend, frontend, integration, acceptance criteria)
3. Generate bug reports for any failures
4. Determine overall status: PASS | FAIL | PARTIAL

### Step 7 — Execute Step 5: Completion
Generate and display the PROJECT COMPLETE REPORT:
```
PROJECT COMPLETE REPORT
═══════════════════════════════════════════
Feature:   <ticket title>
Status:    COMPLETED ✅ | FAILED ❌
Duration:  <time taken>

BACKEND ENDPOINTS:
- POST   /api/v1/<feature>
- GET    /api/v1/<feature>
- GET    /api/v1/<feature>/:id
- PATCH  /api/v1/<feature>/:id
- DELETE /api/v1/<feature>/:id

FRONTEND COMPONENTS:
• <Feature>Card
• <Feature>List
• <Feature>Form
• <Feature>Modal
• Page: app/(dashboard)/<feature>/page.tsx

QA STATUS: PASS ✅ | FAIL ❌ | PARTIAL ⚠️
Bugs Found: <N>

RECOMMENDATIONS:
- <next steps>
═══════════════════════════════════════════
```

## Error Handling
- If Jira ticket cannot be fetched → ask user to paste the ticket content manually
- If frontend-agent fails → continue with backend, note failure in report
- If backend-agent fails → continue with frontend, note failure in report
- If QA finds CRITICAL bugs → mark report as FAILED, list bugs clearly
- Always deliver a final report even if some steps failed

## Output Files Location
- All backend files → `backend/src/<feature>/`
- All frontend files → `frontend/src/`
- Never create files outside these directories
