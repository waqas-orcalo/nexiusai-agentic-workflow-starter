# Skill: jira-explore

## Purpose
Analyze a Jira ticket and extract structured information without starting any development work.
Use this when you want to understand a ticket before committing to implementation.

## When to Use
- User says "analyze this ticket", "what does this Jira ticket say", "explore this issue"
- User wants to understand scope, requirements, and complexity before running the full workflow
- You need to populate a `JiraTicket` object to pass to dev agents

## Steps

### Step 1 — Read Agent Spec
Read `agents/jira-explore-agent/AGENT.md` before proceeding.

### Step 2 — Fetch the Ticket
**Option A — Jira REST API:**
```
GET https://<your-domain>.atlassian.net/rest/api/3/issue/<TICKET-ID>
Authorization: Basic base64(<email>:<api-token>)
Accept: application/json
```

**Option B — If API is unavailable:**
Ask the user to paste the ticket content (title, description, acceptance criteria).

**Option C — From URL pattern:**
If URL is `https://company.atlassian.net/browse/PROJ-123`, extract ticket ID `PROJ-123`.

### Step 3 — Extract Fields

#### Title
The `summary` field from the Jira response, or user-provided title.

#### Description
Clean the description (remove Jira markup, preserve plain text).

#### Acceptance Criteria
Look for:
- A section titled "Acceptance Criteria", "AC", "Definition of Done"
- Bullet lists with items starting with "Given", "When", "Then", "As a user"
- Checkboxes in the description
Extract each as a separate string in the array.

#### Scope Classification
Analyze title + description for these signals:
- **FRONTEND signals:** "UI", "page", "component", "design", "Figma", "button", "form", "modal", "display", "show", "render", "Next.js", "React"
- **BACKEND signals:** "API", "endpoint", "database", "schema", "NestJS", "MongoDB", "service", "CRUD", "authentication", "JWT"
- **FULLSTACK** = both signal sets present, or explicitly stated

#### API Requirements
Find patterns like: `POST /api/v1/...`, `GET /api/...`, HTTP method + path.
For each, extract: `{ method, endpoint, description }`.

#### Design Links
Find URLs containing: `figma.com`, `zeplin.io`, `invision.com`, or image URLs (`.png`, `.jpg`).

#### Edge Cases
Look for: "should not", "must not", "cannot", "if user is not", "when empty", "validation", "error case"

#### Priority
Map from Jira priority field: Highest/Critical → CRITICAL, High → HIGH, Medium → MEDIUM, Low → LOW

### Step 4 — Show Analysis Report

Output the full analysis in this format:

```
JIRA TICKET ANALYSIS
====================
Ticket:   PROJ-123
URL:      https://...
Title:    <title>
Priority: HIGH
Scope:    FULLSTACK

DESCRIPTION:
<clean description>

ACCEPTANCE CRITERIA (N):
1. <criterion>
2. <criterion>

API REQUIREMENTS (N):
• POST /api/v1/feature — Create a feature
• GET  /api/v1/feature — List all features
• ...

DESIGN LINKS (N):
• https://figma.com/...

DEPENDENCIES:
• <dep 1>

EDGE CASES:
• <edge case 1>
• <edge case 2>

ESTIMATED EFFORT: <from ticket or inferred>
```

### Step 5 — Ask User
"Should I proceed with implementation (run-workflow skill), or was this analysis for planning purposes only?"

## Output
Returns a populated `JiraTicket` TypeScript object that can be passed directly to `run-workflow`.

## Notes
- If acceptance criteria cannot be found in the ticket, ask the user to provide them
- If scope is ambiguous, default to FULLSTACK and note the assumption
- Always extract ALL API requirements — missing one means missing backend endpoints
