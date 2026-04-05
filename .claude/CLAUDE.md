# NexusAI — Agentic Workflow

## Project Overview
This is an **agentic software development workflow** powered by 5 specialized AI agents.
Given a Jira ticket URL, the system autonomously analyzes the ticket, plans the work, builds the frontend and backend, and validates through QA.

## Quick Reference — Skills

| Task | Skill to Use |
|------|-------------|
| Run a complete workflow for a Jira ticket | `run-workflow` |
| Only analyze a Jira ticket (no coding) | `jira-explore` |
| Build a frontend feature manually | `frontend-task` |
| Build a backend feature manually | `backend-task` |
| Run QA tests on a completed feature | `qa-testing` |

## Directory Structure

```
nexusai-agentic-workflow/
├── agents/
│   ├── types.ts                    ← All shared TypeScript interfaces
│   ├── main-agent/
│   │   ├── AGENT.md               ← Agent rules and behavior spec
│   │   ├── main-agent.ts          ← Orchestrator class
│   │   └── prompts/
│   ├── jira-explore-agent/
│   │   ├── AGENT.md
│   │   ├── jira-explore-agent.ts
│   │   └── prompts/
│   ├── frontend-agent/
│   │   ├── AGENT.md
│   │   ├── frontend-agent.ts
│   │   └── prompts/
│   ├── backend-agent/
│   │   ├── AGENT.md
│   │   ├── backend-agent.ts
│   │   └── prompts/
│   └── qa-agent/
│       ├── AGENT.md
│       ├── qa-agent.ts
│       └── prompts/
├── workflow/
│   ├── workflow.types.ts           ← Orchestration-specific types
│   ├── orchestrator.ts             ← Top-level WorkflowOrchestrator
│   └── steps/
│       ├── step1-jira-explore.ts
│       ├── step2-planning.ts
│       ├── step3-parallel-dev.ts
│       ├── step4-qa-testing.ts
│       └── step5-completion.ts
├── frontend/                       ← Next.js 14 + MUI + RTK Query (pre-existing)
├── backend/                        ← NestJS 10 + MongoDB (pre-existing)
└── .claude/
    ├── CLAUDE.md                   ← This file
    └── skills/
        ├── run-workflow/SKILL.md
        ├── jira-explore/SKILL.md
        ├── frontend-task/SKILL.md
        ├── backend-task/SKILL.md
        └── qa-testing/SKILL.md
```

## Workflow Steps

```
JIRA_EXPLORE → PLANNING → PARALLEL_DEV → QA_TESTING → COMPLETION
     ↓              ↓            ↓              ↓            ↓
  ticket        plan         FE + BE      bug report    final report
  extracted    created      in parallel   generated     delivered
```

## The 5 Agents

### 1. Main Agent (Orchestrator)
- Controls the entire workflow
- NEVER does development work itself
- Invokes all other agents in the correct order
- Delivers the PROJECT COMPLETE REPORT at the end
- Rule: ALWAYS invoke Jira Explore first, NEVER invoke QA before dev is done

### 2. Jira Explore Agent
- Fetches and analyzes Jira tickets
- Extracts: title, description, acceptance criteria, scope, API requirements, design links, edge cases
- Output: structured `JiraTicket` object (TypeScript)
- Rule: ALWAYS classify scope as FRONTEND, BACKEND, or FULLSTACK

### 3. Frontend Agent
- Working directory: `frontend/`
- Stack: Next.js 14 App Router + MUI v5 + RTK Query + React Hook Form + Yup
- Pattern: Atom → Molecule → Organism → Page
- Rule: NEVER use raw fetch/axios — always use RTK Query services

### 4. Backend Agent
- Working directory: `backend/`
- Stack: NestJS 10 + MongoDB + JWT + Swagger
- Always uses AbstractRepository pattern (NEVER raw Model)
- Always uses soft delete (`isDeleted`) — NEVER hard delete
- Rule: NO hardcoded strings — all messages come from constants files

### 5. QA Agent
- Tests after dev agents complete
- Tests: auth (401/403), validation (400), soft delete, response shapes
- Creates structured bug reports per bug
- Rule: NEVER mark PASS if CRITICAL or HIGH bugs exist

## Key TypeScript Interfaces

```typescript
// Ticket from Jira analysis
interface JiraTicket {
  ticketId, url, title, description,
  acceptanceCriteria: string[],
  scope: 'FRONTEND' | 'BACKEND' | 'FULLSTACK',
  designLinks: string[],
  apiRequirements: ApiRequirement[],
  dependencies: string[],
  edgeCases: string[],
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
}

// Every agent returns this
interface AgentReport {
  agentName, taskId,
  status: 'COMPLETED' | 'FAILED' | 'PARTIAL',
  summary, output, issues,
  completedAt, nextSteps?
}
```

## Hard Rules

1. **Main Agent never writes code** — it only orchestrates
2. **Jira Explore is always Step 1** — no dev before the ticket is analyzed
3. **Frontend + Backend run in parallel** for FULLSTACK scope
4. **QA runs only after all dev agents complete** — never in parallel with dev
5. **All backend work goes in `backend/`** — no backend code outside it
6. **All frontend work goes in `frontend/`** — no frontend code outside it
7. **Agents communicate through Main Agent only** — no direct agent-to-agent calls
8. **QA Agent never modifies code** — reports only

## Running the Workflow

```typescript
import { createOrchestrator } from './workflow/orchestrator';

const orchestrator = createOrchestrator();
const report = await orchestrator.run(
  'https://company.atlassian.net/browse/PROJ-123',
  'user@company.com'
);
console.log(report);
```

## Dry Run (Plan Only)

```typescript
const orchestrator = createOrchestrator({ dryRun: true });
await orchestrator.run(jiraUrl, userId);
```

## Adding a New Agent

1. Create `agents/<name>-agent/AGENT.md` — define role, capabilities, hard rules
2. Create `agents/<name>-agent/<name>-agent.ts` — implement the agent class
3. Create `agents/<name>-agent/prompts/system.prompt.ts` — LLM system prompt
4. Register in `agents/types.ts` — add to `AgentName` union type
5. Create `.claude/skills/<name>-task/SKILL.md` — Claude Cowork skill
6. Invoke from `MainAgent` at the correct workflow step
