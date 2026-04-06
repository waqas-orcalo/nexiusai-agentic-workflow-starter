# Skill: Project Exploration

## When to activate
Trigger on: "explore this site", "crawl this app", "document this project", "analyze this URL before
we build", "map out the flows", "reverse-engineer the business logic", "create a spec from this site",
"generate docs for frontend/backend agents", or any URL passed for analysis, planning, or replication.

Use proactively before any build/clone task — good exploration prevents wasted building effort.

---

## Goal
Visit a URL, understand the product deeply, and produce a clean, reusable specification document
that frontend and backend engineers (human or AI) can use without visiting the site themselves.

Speed and structure matter. Be terse — use tables and bullet lists, not prose.

---

## Phase 1 — Discover & Crawl

1. Navigate to the root URL. Take a screenshot. Note: app type (SPA, MPA, dashboard, marketing),
   auth gates, primary nav structure.

2. Systematic crawl — for every distinct route/view:
   - Note URL path and page title
   - Identify primary purpose (what job does it do for the user?)
   - List interactive elements: forms, buttons, modals, tabs, dropdowns
   - Note data displayed (tables, charts, cards, feeds)

3. Trigger hidden states — click things:
   - Open dropdowns, hover menus, accordions
   - Trigger modals, drawers, toasts
   - Submit forms (empty, valid, invalid) to see validation and success states
   - Try pagination, filters, sorting

4. Walk the 2–4 core user journeys completely (sign up → onboard → use core feature → upgrade).

**Token efficiency:** Screenshot + label > prose description. A table of entities > paragraphs about them.

---

## Phase 2 — Extract Business Logic

For each major feature or section, identify:
- **Entities** — core data objects (e.g., User, Project, Invoice, Post)
- **Relationships** — how entities relate (one-to-many, ownership, hierarchy)
- **Rules** — constraints/logic (e.g., "max 3 free projects", "invoices can only be deleted if status = draft")
- **States & transitions** — what states an entity can be in; what triggers transitions
- **Permissions** — are there roles? what can each role do?
- **Integrations** — visible third-party services (payments, auth, analytics, maps)

Source signals: UI text, form labels, error messages, tooltips, help text, URL patterns.

---

## Phase 3 — Write the Documentation

```
# [App Name] — Project Exploration Report

## 1. Overview
- Product type & category
- Target user / persona
- Core value proposition (1–2 sentences)
- Tech signals (framework hints, CDN assets, API patterns observed)

## 2. Site Map
| Path | Page Name | Purpose |
|------|-----------|---------|

## 3. Core User Flows
**Flow: [Name]**
Steps: step1 → step2 → step3
Screens touched: [list]
Success state: [what happens when complete]
Error states: [what can go wrong]

## 4. UI Component Inventory
| Component | Where Used | Notes |
|-----------|------------|-------|

## 5. Business Logic & Domain Model

### Entities
| Entity | Key Fields | Notes |
|--------|------------|-------|

### Rules & Constraints
- [Rule 1]

### State Machines
**[Entity] states:** draft → submitted → approved → archived

### Roles & Permissions
| Role | Can Do | Cannot Do |
|------|--------|-----------|

## 6. API / Data Signals
- Visible API calls, REST patterns, GraphQL queries
- Pagination patterns
- Auth mechanism (JWT headers, cookies, OAuth redirects)

## 7. Integrations & Third-Party Services
| Service | Evidence | Purpose |
|---------|----------|---------|

## 8. Frontend Agent Spec
- Component hierarchy
- State management needs
- Key interactions to implement
- Design tokens to extract (colors, fonts, spacing)

## 9. Backend Agent Spec
- Data models to create
- API endpoints needed (inferred from UI flows)
- Auth strategy
- Business rules to enforce at the API level

## 10. Open Questions
- Anything ambiguous, hidden behind auth, or needing clarification
```

---

## Delivery

Save as three standalone files in the workspace folder:
- `[app-name]-exploration-report.md`
- `[app-name]-frontend-spec.md` (Section 8 extracted)
- `[app-name]-backend-spec.md` (Section 9 extracted)

---

## Quality Checklist

- [ ] Every main nav item has been visited
- [ ] At least 2 core user flows are fully documented
- [ ] Domain entities are identified with their key fields
- [ ] Business rules extracted from UI text/constraints
- [ ] Frontend spec is actionable (a dev could start building from it)
- [ ] Backend spec lists concrete endpoints and data models
- [ ] Open questions logged for anything unreachable or ambiguous

---

## Handling Edge Cases

**Auth walls:** If login is required, document everything visible before the wall.
Note what's likely behind it based on nav labels, marketing copy, and pricing tiers.
Add as items in Section 10 (Open Questions).

**80/20 rule:** 80% deep on core flows, 20% surface-level on edge pages.
If a page is structurally identical to another, note the pattern once and reference it.
