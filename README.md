# NexusAI — Agentic Workflow

An autonomous multi-agent software development system. Feed it a Jira ticket URL and it analyzes the requirements, plans the work, builds frontend + backend in parallel, and validates through QA — all without human intervention.

## Agents

| Agent | Role | Works In |
|-------|------|----------|
| `main-agent` | Orchestrator — controls everything | — |
| `jira-explore-agent` | Analyzes Jira tickets | — |
| `frontend-agent` | Builds UI, components, RTK Query services | `frontend/` |
| `backend-agent` | Builds NestJS APIs, schemas, services | `backend/` |
| `qa-agent` | Tests implementations, generates bug reports | — |

## Workflow

```
Jira URL
   ↓
[Jira Explore] → Extract ticket, scope, acceptance criteria
   ↓
[Planning] → Create execution plan, assign tasks
   ↓
[Parallel Dev] → Frontend Agent ⚡ Backend Agent (simultaneous)
   ↓
[QA Testing] → Test all endpoints, components, integrations
   ↓
[Completion] → PROJECT COMPLETE REPORT
```

## Quick Start

### Run a Complete Workflow (Claude Cowork)
Use the `run-workflow` skill and provide your Jira ticket URL.

### Run Programmatically
```typescript
import { createOrchestrator } from './workflow/orchestrator';

const orchestrator = createOrchestrator();
const report = await orchestrator.run(
  'https://company.atlassian.net/browse/PROJ-123',
  'developer@company.com'
);
```

### Listen to Events
```typescript
orchestrator.onEvent((event) => {
  console.log(`[${event.type}] Step: ${event.step}`);
});
```

### Dry Run (Plan Only)
```typescript
const orchestrator = createOrchestrator({ dryRun: true });
await orchestrator.run(jiraUrl, userId);
```

## Claude Cowork Skills

| Skill | Description |
|-------|-------------|
| `run-workflow` | Full 5-step automated pipeline |
| `jira-explore` | Analyze a ticket only (no coding) |
| `frontend-task` | Build frontend feature manually |
| `backend-task` | Build backend feature manually |
| `qa-testing` | Run QA on a completed feature |

## Tech Stack

**Agents Build Into:**
- **Frontend:** Next.js 14 (App Router) + MUI v5 + RTK Query + React Hook Form + Yup
- **Backend:** NestJS 10 + MongoDB (Mongoose) + JWT Auth + Swagger + class-validator

**Agent System:**
- TypeScript 5 strict mode
- Shared type contracts via `agents/types.ts`
- Step-based orchestration via `workflow/steps/`

## Project Structure

```
nexusai-agentic-workflow/
├── agents/
│   ├── types.ts                    ← Shared TypeScript interfaces
│   ├── main-agent/
│   │   ├── AGENT.md               ← Rules and behavior
│   │   ├── main-agent.ts          ← Orchestrator class
│   │   └── prompts/
│   ├── jira-explore-agent/
│   ├── frontend-agent/
│   ├── backend-agent/
│   └── qa-agent/
├── workflow/
│   ├── workflow.types.ts
│   ├── orchestrator.ts
│   └── steps/
│       ├── step1-jira-explore.ts
│       ├── step2-planning.ts
│       ├── step3-parallel-dev.ts
│       ├── step4-qa-testing.ts
│       └── step5-completion.ts
├── frontend/                       ← Next.js app (pre-existing)
├── backend/                        ← NestJS app (pre-existing)
├── .claude/
│   ├── CLAUDE.md
│   └── skills/
│       ├── run-workflow/SKILL.md
│       ├── jira-explore/SKILL.md
│       ├── frontend-task/SKILL.md
│       ├── backend-task/SKILL.md
│       └── qa-testing/SKILL.md
├── package.json
└── tsconfig.json
```

## Hard Rules

1. **Main Agent never writes code** — it orchestrates only
2. **Jira Explore always runs first** — no dev before requirements are understood
3. **Frontend + Backend run in parallel** for FULLSTACK scope
4. **QA runs only after dev is complete** — never in parallel
5. **All backend code goes in `backend/`** — no exceptions
6. **All frontend code goes in `frontend/`** — no exceptions
7. **No agent communicates directly with another** — all via Main Agent
8. **QA Agent never modifies code** — reports bugs only

## Final Report Shape

```
PROJECT COMPLETE REPORT
═══════════════════════════════════════
Feature:   <Ticket Title>
Status:    COMPLETED ✅ | FAILED ❌
Duration:  4m 32s

BACKEND ENDPOINTS (5):
- POST   /api/v1/<feature>
- GET    /api/v1/<feature>
- GET    /api/v1/<feature>/:id
- PATCH  /api/v1/<feature>/:id
- DELETE /api/v1/<feature>/:id

FRONTEND COMPONENTS (5):
• <Feature>Card, <Feature>List, <Feature>Form, <Feature>Modal
• Page: app/(dashboard)/<feature>/page.tsx

QA STATUS: PASS ✅ | FAIL ❌  Bugs: 0

RECOMMENDATIONS:
- Ready for code review and merge
═══════════════════════════════════════
```
