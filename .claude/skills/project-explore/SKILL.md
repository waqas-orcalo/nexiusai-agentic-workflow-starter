# Skill: project-explore

## Identity
**Agent:** Project Exploration Agent
**Role:** Deep crawler, analyst, and documentation generator
**Output consumers:** `frontend-agent`, `backend-agent`, `qa-agent`, `main-agent`

## Purpose
Given a live URL, fully explore a web application — its pages, UI flows, components, API calls, and business logic — and produce structured, reusable documentation that enables any downstream agent to implement or test the system without ever visiting the URL themselves.

## When to Use
- User says: "explore this app", "analyze this site", "crawl this URL", "reverse-engineer this"
- User provides a URL before a `run-workflow`, `frontend-task`, or `website-replicator` run
- You need to understand an existing system before building a new one inspired by it
- Scope is unknown and must be discovered by observation

---

## ⚡ Token Efficiency Rules (read before crawling)

These rules apply to every phase. Violating them wastes context and slows downstream agents.

1. **Compress redundancy** — If 3 pages share the same header/nav, document it once under `SHARED_COMPONENTS`, not per page.
2. **Use tables over prose** — Routes, components, API endpoints, and field schemas are always tables, never paragraphs.
3. **Skip noise** — Ignore cookie banners, analytics scripts, social share buttons, and ads unless they affect business logic.
4. **Infer, don't describe** — Instead of "there is a button that says Submit", write `FormSubmitButton → POST /api/orders`.
5. **One screenshot per unique layout** — Do not capture the same layout twice. Capture only: desktop home, unique page types, modal states.
6. **Cap depth** — Maximum 3 levels of sub-navigation unless a deeper level introduces genuinely new business logic.
7. **Deduplicate API calls** — If the same endpoint is called on 5 pages, list it once in the API Inventory, not 5 times.

---

## Execution Phases

### Phase 0 — Preflight (before crawling)

1. Confirm the URL is reachable (navigate to it, check for 200 or redirect).
2. Detect the app type:
   - **SPA** (React, Vue, Angular) — URL changes without full page reload, look for `__next`, `__nuxt`, React root divs
   - **SSR** (Next.js, Nuxt) — `<meta name="generator">` tag, `/_next/` paths
   - **MPA** (traditional multi-page) — full reloads on navigation
   - **Mobile Web** — viewport meta, touch events, bottom nav bar
3. Note the auth wall status:
   - **PUBLIC** — accessible without login
   - **AUTH_REQUIRED** — redirects to login immediately
   - **MIXED** — some pages public, some gated

Record these in the header of the output doc. They control crawling strategy.

---

### Phase 1 — Route Map (max 15 min / 8K tokens)

**Goal:** Enumerate all navigable routes.

**Method:**
1. Start at the root URL.
2. Collect all `<a href>` and `<Link>` elements visible on load.
3. Check for nav menus (desktop + mobile hamburger), sidebar, breadcrumbs.
4. Interact with dropdowns, tabs, and expandable menus to reveal hidden routes.
5. Check `robots.txt` and `sitemap.xml` for additional paths.
6. Scan source for route patterns in JS bundles (`/routes`, `/pages`, `router.push`).

**Output format — Route Registry:**
```
ROUTE REGISTRY
==============
ID   | Path                    | Auth? | Page Type       | Notes
-----|-------------------------|-------|-----------------|---------------------------
R01  | /                       | No    | Landing/Home    | Hero + CTA + feature grid
R02  | /dashboard              | Yes   | Dashboard       | Stats cards + activity feed
R03  | /dashboard/orders       | Yes   | List View       | Paginated table + filters
R04  | /dashboard/orders/:id   | Yes   | Detail View     | Order timeline + actions
R05  | /auth/login             | No    | Auth Form       | Email + password + OAuth
R06  | /auth/signup            | No    | Auth Form       | Multi-step form (3 steps)
R07  | /settings               | Yes   | Settings        | Tabs: Profile, Security, Billing
R08  | /settings/billing       | Yes   | Billing         | Plan cards + payment form
```

**Stop crawling a route if:**
- It is a duplicate layout with different data (document the pattern once)
- It requires credentials you don't have
- It returns 404 or 403

---

### Phase 2 — UI Anatomy (max 20 min / 12K tokens)

**Goal:** Document every distinct layout pattern and reusable component.

**Method:** For each unique route type (NOT each individual route), identify:
- Layout shell (sidebar, topbar, footer presence)
- Primary content area (what the page is "about")
- Reusable components on that layout
- Interactive elements and what they trigger

**Output format — Component Inventory:**
```
COMPONENT INVENTORY
===================
ID   | Name              | Type      | Props / Data            | Actions
-----|-------------------|-----------|-------------------------|-------------------------
C01  | TopNav            | Layout    | logo, user.name, links  | search, notifications, avatar menu
C02  | Sidebar           | Layout    | routes[], activeRoute   | collapse toggle
C03  | StatCard          | Atom      | title, value, delta, icon | click → drill-down route
C04  | DataTable         | Organism  | columns[], rows[], total | sort, filter, paginate, row click
C05  | OrderRow          | Molecule  | order{id,status,total}  | expand, quick-action menu
C06  | StatusBadge       | Atom      | status: enum            | none (display only)
C07  | FilterBar         | Molecule  | fields[], onApply       | form submit → refetch
C08  | CreateOrderModal  | Organism  | open, onClose           | multi-step form → POST /api/orders
C09  | ConfirmDialog     | Atom      | title, msg, onConfirm   | confirm → DELETE /api/orders/:id
C10  | Pagination        | Atom      | page, total, limit      | onChange → refetch
```

**Layout Patterns (document once, reference by ID):**
```
LAYOUT PATTERNS
===============
LP01 — AUTH_SHELL:      No sidebar, centered card, logo top
LP02 — DASHBOARD_SHELL: TopNav + Sidebar + Main content area
LP03 — SETTINGS_SHELL:  LP02 + secondary tab nav inside main
LP04 — FULLPAGE_MODAL:  Overlay over LP02, no sidebar visible
```

**For each route, reference layout + components:**
```
R03 /dashboard/orders → LP02 + [C01, C02, C04, C07, C10, C08]
R04 /dashboard/orders/:id → LP02 + [C01, C02, C05, C09]
```

---

### Phase 3 — User Flow Extraction (max 15 min / 8K tokens)

**Goal:** Document all distinct user journeys as numbered flows with steps.

**Focus on flows that involve:**
- Data creation, update, or deletion
- Authentication and authorization
- Multi-step processes (wizards, checkout, onboarding)
- State transitions (draft → submitted → approved)

**Output format — Flow Registry:**
```
FLOW REGISTRY
=============

FLOW-01: User Sign-Up
─────────────────────
Trigger: Click "Get Started" on / (R01)
Steps:
  1. Navigate to /auth/signup (R06)
  2. Step 1: Enter email + password → validate inline
  3. Step 2: Enter profile info (name, company) → validate
  4. Step 3: Select plan → renders billing form
  5. Submit → POST /api/auth/signup → redirect /dashboard (R02)
Error states:
  - Email already exists → inline error under email field
  - Weak password → strength indicator + blocking message
  - Payment failed → toast error, stays on step 3

FLOW-02: Create Order
──────────────────────
Trigger: "+ New Order" button on /dashboard/orders (R03) → opens C08
Steps:
  1. Select customer → GET /api/customers (typeahead)
  2. Add line items → GET /api/products (typeahead per item)
  3. Confirm summary → computed totals (client-side)
  4. Submit → POST /api/orders → modal closes, table refetches
Error states:
  - No items → submit disabled
  - Stock unavailable → item row shows warning badge

FLOW-03: Delete Order
──────────────────────
Trigger: "Delete" action in C05 quick-action menu
Steps:
  1. Click delete → C09 ConfirmDialog opens
  2. Confirm → DELETE /api/orders/:id
  3. Success → row removed from C04, success toast
Error states:
  - Order in shipped state → action disabled (greyed out, tooltip)
```

**State Machine (for entities with status transitions):**
```
ORDER STATUS TRANSITIONS
========================
DRAFT ──────────────────→ SUBMITTED (user submits form)
SUBMITTED ──────────────→ PROCESSING (system/webhook)
PROCESSING ─────────────→ SHIPPED (admin action)
PROCESSING ─────────────→ CANCELLED (admin or user)
SHIPPED ────────────────→ DELIVERED (webhook)
DELIVERED ──────────────→ REFUNDED (user request → admin approval)
```

---

### Phase 4 — API Inventory (max 15 min / 8K tokens)

**Goal:** Enumerate every backend API call observed in the application.

**Method:**
1. Open browser DevTools → Network tab (XHR/Fetch filter).
2. Perform key user flows (sign-in, CRUD on main entity, pagination, filters).
3. Capture each unique request: method, path, payload shape, response shape.
4. Check page source for hardcoded base URLs, environment flags, SDK calls.

**Output format — API Inventory:**
```
API INVENTORY
=============
ID   | Method | Endpoint                    | Auth | Payload                        | Response Shape
-----|--------|-----------------------------|------|--------------------------------|----------------------------------
A01  | POST   | /api/auth/signup            | No   | {email,password,name,plan}     | {token,user{id,email,role}}
A02  | POST   | /api/auth/login             | No   | {email,password}               | {accessToken,refreshToken,user}
A03  | POST   | /api/auth/refresh           | No   | {refreshToken}                 | {accessToken}
A04  | GET    | /api/orders                 | Yes  | ?page&limit&status&search      | {data:[Order],meta{total,page,limit}}
A05  | POST   | /api/orders                 | Yes  | {customerId,items[],notes}     | {data:Order}
A06  | GET    | /api/orders/:id             | Yes  | —                              | {data:Order}
A07  | PATCH  | /api/orders/:id             | Yes  | Partial<Order>                 | {data:Order}
A08  | DELETE | /api/orders/:id             | Yes  | —                              | {data:null}
A09  | GET    | /api/customers              | Yes  | ?search&limit                  | {data:[Customer]}
A10  | GET    | /api/products               | Yes  | ?search&categoryId             | {data:[Product]}
A11  | GET    | /api/dashboard/stats        | Yes  | ?period=7d|30d|90d             | {revenue,orders,customers,growth}
```

**Standard Response Envelope (if consistent):**
```json
{
  "success": true,
  "message": "string",
  "data": "T | T[] | null",
  "meta": { "total": 0, "page": 1, "limit": 10, "totalPages": 0 }
}
```

**Authentication scheme:**
```
Type:     Bearer JWT
Header:   Authorization: Bearer <accessToken>
Refresh:  POST /api/auth/refresh with refreshToken in body
Storage:  localStorage['accessToken'] (or httpOnly cookie — note which)
```

**WebSocket / SSE (if present):**
```
WS-01 | ws://host/ws/notifications | Auth: token in query param | Events: ORDER_UPDATE, NEW_MESSAGE
```

---

### Phase 5 — Business Logic Extraction (max 15 min / 6K tokens)

**Goal:** Document rules, constraints, and computed values that are NOT obvious from the UI alone.

**Categories to capture:**

#### Validation Rules
```
VALIDATION RULES
================
Entity: Order
─────────────────────────────────────────────────────
Field         | Rule
--------------|------------------------------------------
items         | min 1 item required to submit
item.quantity | integer > 0
item.price    | float > 0, max 2 decimal places
notes         | optional, max 500 chars
status        | enum: DRAFT|SUBMITTED|PROCESSING|SHIPPED|DELIVERED|CANCELLED|REFUNDED

Entity: User
─────────────────────────────────────────────────────
email         | valid email format, unique per system
password      | min 8 chars, 1 upper, 1 number, 1 special
```

#### Role-Based Access Control
```
RBAC MATRIX
===========
Action                  | ADMIN | MANAGER | USER
------------------------|-------|---------|-----
View all orders         |  ✅   |   ✅    |  ❌ (own only)
Create order            |  ✅   |   ✅    |  ✅
Delete order            |  ✅   |   ❌    |  ❌
View billing            |  ✅   |   ❌    |  ✅ (own only)
Access /settings/users  |  ✅   |   ❌    |  ❌
```

#### Computed / Derived Values
```
COMPUTED VALUES
===============
Order.subtotal     = sum(item.price × item.quantity)
Order.tax          = subtotal × 0.08 (or user's region rate)
Order.total        = subtotal + tax + shipping
Order.itemCount    = items.length
Dashboard.growth   = ((current - previous) / previous) × 100
```

#### Business Constraints
```
BUSINESS CONSTRAINTS
====================
- Orders in SHIPPED or DELIVERED status cannot be deleted
- A REFUNDED order cannot be refunded again
- Customers with outstanding orders cannot be deleted
- Products with quantity=0 show "Out of Stock" and disable add-to-cart
- Free plan users: max 10 orders/month (enforced server-side, shown in UI as quota bar)
```

---

### Phase 6 — Data Schema Inference (max 10 min / 4K tokens)

**Goal:** Infer entity schemas from API responses, form fields, and displayed data. These become the basis for backend Mongoose schemas and frontend TypeScript types.

**Output format — Entity Schemas:**
```
ENTITY SCHEMAS
==============

Order {
  _id:         string (MongoDB ObjectId)
  customerId:  string (ref → Customer)
  items:       OrderItem[]
  status:      'DRAFT'|'SUBMITTED'|'PROCESSING'|'SHIPPED'|'DELIVERED'|'CANCELLED'|'REFUNDED'
  notes?:      string
  subtotal:    number
  tax:         number
  total:       number
  createdBy:   string (ref → User)
  createdAt:   Date
  updatedAt:   Date
  isDeleted:   boolean  (soft delete pattern observed)
}

OrderItem {
  productId:  string (ref → Product)
  name:       string  (denormalized at time of order)
  price:      number
  quantity:   number
}

Customer {
  _id:        string
  name:       string
  email:      string
  phone?:     string
  address?:   Address
  createdAt:  Date
}

User {
  _id:        string
  email:      string
  name:       string
  role:       'ADMIN'|'MANAGER'|'USER'
  plan:       'FREE'|'PRO'|'ENTERPRISE'
  createdAt:  Date
}
```

---

### Phase 7 — Design System Snapshot (max 10 min / 3K tokens)

**Goal:** Extract just enough design tokens for the frontend-agent to match visual fidelity. Not a full design audit — focus on actionable values only.

**Output format:**
```
DESIGN SYSTEM SNAPSHOT
=======================

Colors (semantic names → hex):
  primary:        #2563EB   (buttons, links, active states)
  primary-hover:  #1D4ED8
  success:        #16A34A   (DELIVERED badge, positive delta)
  warning:        #D97706   (PROCESSING badge)
  error:          #DC2626   (CANCELLED badge, error states)
  neutral-900:    #111827   (primary text)
  neutral-500:    #6B7280   (secondary text, placeholders)
  neutral-100:    #F3F4F6   (table row alt background)
  surface:        #FFFFFF   (cards, modals)
  background:     #F9FAFB   (page background)

Typography:
  font-family:    'Inter', sans-serif
  heading-xl:     700 / 30px / -0.02em  (page titles)
  heading-lg:     600 / 24px / -0.01em  (section titles)
  body:           400 / 14px / 1.5      (default)
  caption:        400 / 12px / 1.4      (labels, helper text)

Spacing scale:    4px base (4, 8, 12, 16, 24, 32, 48, 64)
Border radius:    sm=4px  md=8px  lg=12px  full=9999px
Shadows:          card=0 1px 3px rgba(0,0,0,0.1)  modal=0 20px 60px rgba(0,0,0,0.2)

Component patterns:
  Buttons:        rounded-md, px-4 py-2, font-medium
  Inputs:         border border-neutral-300, rounded-md, focus:ring-2 ring-primary
  Status badges:  rounded-full, px-2 py-0.5, text-xs, font-medium, colored bg
  Tables:         no outer border, row dividers only, hover:bg-neutral-50
  Modals:         max-w-lg, rounded-xl, backdrop blur
```

---

### Phase 8 — Agent Handoff Documents (structured output, no token limit)

**Goal:** Generate two standalone documents — one for the frontend agent, one for the backend agent — that contain ONLY what each agent needs, with zero redundancy between them.

#### 8A — Frontend Agent Handoff

```
FRONTEND AGENT HANDOFF
======================
Source App: <URL>
Exploration Date: <date>

TASK SUMMARY
------------
Implement a [SPA/SSR] frontend in Next.js 14 (App Router) + MUI v5 + RTK Query
that replicates the UI and flows documented below.

ROUTES TO IMPLEMENT
-------------------
[Paste Route Registry subset relevant to frontend]

COMPONENT SPEC
--------------
[Paste Component Inventory]

LAYOUT PATTERNS
---------------
[Paste Layout Patterns]

FLOWS TO IMPLEMENT
------------------
[Paste relevant flows from Flow Registry]

RTK QUERY SERVICES NEEDED
--------------------------
Map each API endpoint to an RTK Query hook:
  useGetOrdersQuery          → GET /api/orders
  useGetOrderByIdQuery       → GET /api/orders/:id
  useCreateOrderMutation     → POST /api/orders
  useUpdateOrderMutation     → PATCH /api/orders/:id
  useDeleteOrderMutation     → DELETE /api/orders/:id
  useGetDashboardStatsQuery  → GET /api/dashboard/stats

DESIGN TOKENS
-------------
[Paste Design System Snapshot]

ACCEPTANCE CRITERIA (frontend)
-------------------------------
- [ ] All routes in Route Registry are implemented and navigable
- [ ] All components in Component Inventory exist with correct props
- [ ] All flows in Flow Registry work end-to-end against real API
- [ ] Loading, error, and empty states handled for all data-fetching components
- [ ] RBAC: routes/actions hidden from unauthorized roles
- [ ] Design tokens applied consistently
```

#### 8B — Backend Agent Handoff

```
BACKEND AGENT HANDOFF
=====================
Source App: <URL>
Exploration Date: <date>

TASK SUMMARY
------------
Implement a NestJS 10 + MongoDB backend with all endpoints documented below.
Follow aac-monolith-starter patterns: AbstractRepository, soft delete, JWT auth, Swagger.

ENTITIES TO IMPLEMENT
---------------------
[Paste Entity Schemas]

VALIDATION RULES
----------------
[Paste Validation Rules]

RBAC REQUIREMENTS
-----------------
[Paste RBAC Matrix]

BUSINESS CONSTRAINTS
--------------------
[Paste Business Constraints]

COMPUTED VALUES (implement server-side)
---------------------------------------
[Paste Computed Values]

ENDPOINTS TO IMPLEMENT
----------------------
[Paste API Inventory]

STATE TRANSITIONS (enforce in service layer)
--------------------------------------------
[Paste State Machine]

AUTH SPEC
---------
[Paste Authentication scheme]

ACCEPTANCE CRITERIA (backend)
-------------------------------
- [ ] All endpoints in API Inventory are implemented
- [ ] All validation rules enforced via class-validator DTOs
- [ ] RBAC enforced via @Roles() guard on each endpoint
- [ ] Soft delete used for all entity deletions
- [ ] Business constraints enforced in service layer (not just DTO)
- [ ] Status transitions validated before updates
- [ ] Swagger docs complete at /docs
- [ ] All responses follow the standard envelope shape
```

---

## Crawl Depth Decision Tree

Use this to decide whether to follow a link or stop:

```
Is this route/page unique in layout AND business logic?
├── YES → Crawl and document it
└── NO (same layout, different data) → Note the pattern, skip crawl

Does this route require credentials you don't have?
├── YES → Document as AUTH_REQUIRED, note what role is needed, skip crawl
└── NO → Proceed

Is this a third-party page (payment, OAuth, etc.)?
├── YES → Document the redirect target + return URL only, skip crawl
└── NO → Proceed

Have you already seen this component/pattern on another route?
├── YES → Reference the existing component ID (e.g., "uses C04"), don't re-document
└── NO → Document as new component
```

---

## Handling Auth-Gated Apps

If the app requires authentication:

1. **Ask the user** for test credentials (email + password, or OAuth token).
2. If credentials provided: sign in, store the token, proceed with full crawl.
3. If NO credentials: crawl all public routes fully, then:
   - Document auth-gated routes from any visible navigation or sitemap
   - Mark them `AUTH_REQUIRED` in the Route Registry
   - Infer their content from page titles, breadcrumbs, or API calls observed pre-auth
4. **Never fabricate** page content for routes you cannot access. Mark them clearly as `INFERRED`.

---

## Output File

Save the complete exploration output as a single markdown file:

**Location:** `agents/reports/exploration-<domain>-<YYYYMMDD>.md`

**Sections (always in this order):**
1. `# EXPLORATION REPORT` — header with URL, date, app type, auth status
2. `## ROUTE REGISTRY`
3. `## COMPONENT INVENTORY`
4. `## LAYOUT PATTERNS`
5. `## FLOW REGISTRY`
6. `## API INVENTORY`
7. `## BUSINESS LOGIC`
   - Validation Rules
   - RBAC Matrix
   - Business Constraints
   - Computed Values
   - State Machines
8. `## ENTITY SCHEMAS`
9. `## DESIGN SYSTEM SNAPSHOT`
10. `## FRONTEND AGENT HANDOFF`
11. `## BACKEND AGENT HANDOFF`

---

## Hard Rules

1. **NEVER fabricate** routes, components, endpoints, or business rules you did not observe
2. **ALWAYS mark inferred content** with `[INFERRED]` tag so downstream agents know what to verify
3. **NEVER describe what you see** — extract what it means. "A blue button labeled Create Order" → `CreateOrderButton → POST /api/orders`
4. **ALWAYS emit both handoff docs** (8A + 8B) even if scope is FRONTEND-only or BACKEND-only
5. **NEVER exceed 3 levels** of component nesting in documentation (Atom → Molecule → Organism is enough)
6. **ALWAYS capture error states** for every user flow — they are as important as the happy path
7. **ALWAYS produce the output file** — never output exploration results only in the chat
8. **ALWAYS version the report** — include URL + date in the filename and header

---

## Quality Checklist (verify before outputting)

- [ ] Route Registry: every navigable path has an entry
- [ ] Component Inventory: every distinct UI element has an ID
- [ ] Flow Registry: every CUD operation has a documented flow
- [ ] API Inventory: every XHR/fetch call is captured with payload + response shape
- [ ] Business Logic: all validation rules, constraints, RBAC, and computed values documented
- [ ] Entity Schemas: all entities inferred from observed data
- [ ] Design Snapshot: colors, fonts, spacing captured
- [ ] Frontend Handoff: self-contained, references only IDs from this report
- [ ] Backend Handoff: self-contained, references only IDs from this report
- [ ] Output file saved to `agents/reports/`
- [ ] No fabricated data — everything observed or clearly marked `[INFERRED]`
