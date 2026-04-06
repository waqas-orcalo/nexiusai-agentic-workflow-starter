// ─────────────────────────────────────────────────────────────────────────────
//  Frontend Agent — Skills Prompts
//  Each export is a self-contained skill instruction set that the agent
//  should follow when the corresponding task type is triggered.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Skill: Deep UI Navigation Crawler ───────────────────────────────────────
export const SKILL_DEEP_UI_CRAWLER = `
## Skill: Deep UI Navigation Crawler

Run this skill FIRST before any design extraction, component analysis, or replication task.

### Phase 1 — Initial Page Survey
1. Navigate to the target URL. Take a full-page screenshot (baseline).
2. Collect all navigation entry points (top nav, sidebar, footer, breadcrumbs, tab bars).
3. Run this JS to extract all internal links:
   const links = Array.from(document.querySelectorAll('a[href]'))
     .map(a => ({ text: a.innerText.trim(), href: a.href }))
     .filter(l => l.href.startsWith(window.location.origin) && l.text);
4. Classify: Static/marketing site → light crawl | SPA/dashboard → medium | Complex app → deep crawl

### Phase 2 — Navigation Traversal
For each discovered route: screenshot, note URL + title + purpose, identify unexplored interactions.

### Phase 3 — Interactive UI Exploration
Systematically interact with: dropdowns (screenshot open state), modals (Add/New/Create/Edit/Delete/Settings buttons),
tabs (click every tab), accordions (expand all collapsed), hover menus, side drawers, forms (empty/filled/error states).

Run this JS to find all interactive elements:
  const interactive = Array.from(document.querySelectorAll(
    'button, [role="button"], [aria-haspopup], [aria-expanded], details, summary, .accordion, .tab, [role="tab"]'
  )).map(el => ({ tag: el.tagName, text: el.innerText?.trim().slice(0, 50), role: el.getAttribute('role') }))
    .filter(el => el.text || el.role);

### Phase 4 — Nested Flow Exploration
Walk through: auth flows (signup/login), onboarding flows, creation/wizard flows,
dashboard interactions (charts, filters, date pickers, tables), empty and loading states.

### Phase 5 — UI Map Output
Produce a structured report covering: route map, interactive component inventory
(modals, dropdowns, tabs, side drawers, forms), nested flows, auth-gated areas,
and recommended crawl order for downstream skills.
`.trim();


// ─── Skill: Make Responsive ───────────────────────────────────────────────────
export const SKILL_MAKE_RESPONSIVE = `
## Skill: Make Responsive

Only two types of changes are allowed:
1. Add className props to JSX elements (additive — NEVER modify existing style props)
2. Write @media rules in globals.css

### Standard Breakpoints
- Tablet: max-width 1024px — sidebars collapse, fonts shrink
- Mobile: max-width 768px — stacked layouts, full-width elements, hidden columns
- Small mobile: max-width 480px — extra padding reduction, smaller text

### Process
1. Read globals.css to understand what already exists.
2. Read target component(s). Identify: fixed-width containers, flex rows, sidebars, wide tables, hardcoded paddings.
3. Check existing class naming convention (e.g. t-, l-, a-). Use a prefix matching the page name.
4. Add className to JSX elements — use descriptive role-based names like t-filter-bar, l-course-grid.
5. Write all media queries in globals.css under a labeled section comment.
6. For mobile sidebars: add useState(false) for open/close + hamburger button (CSS display: none on desktop) + overlay div.
7. For tables: add scroll wrapper div with overflow-x: auto, or hide secondary columns on mobile.

### Rules
- NEVER modify the existing style prop values
- NEVER put responsive CSS in a <style> JSX tag (causes SSR hydration errors)
- NEVER change onClick, onChange, or any event handlers
- NEVER change state variables, hooks, or data fetching
- Use !important sparingly — only when overriding inline styles with responsive overrides
- Never use > child combinator in JSX style tags — only in globals.css
`.trim();


// ─── Skill: Project Exploration ───────────────────────────────────────────────
export const SKILL_PROJECT_EXPLORATION = `
## Skill: Project Exploration

Produce a clean, reusable spec document that developers (human or AI) can use without visiting the site.
Be terse — use tables and bullet lists. Avoid prose.

### Phase 1 — Discover & Crawl
1. Navigate to root URL. Screenshot. Note app type, auth gates, nav structure.
2. Visit every distinct route/view: note URL, title, purpose, interactive elements, data displayed.
3. Trigger hidden states: click dropdowns, hover menus, accordions, open modals/drawers/toasts,
   submit forms (empty/valid/invalid), try pagination/filters/sorting.
4. Walk 2–4 core user journeys completely.

### Phase 2 — Extract Business Logic
For each major feature identify: Entities (core data objects), Relationships, Rules/Constraints,
State machines (draft → submitted → approved → archived), Roles & Permissions, Integrations.

### Phase 3 — Document Output
Produce a structured report with 10 sections:
1. Overview (type, persona, value prop, tech signals)
2. Site Map (table: path | page name | purpose)
3. Core User Flows (steps, screens touched, success state, error states)
4. UI Component Inventory
5. Business Logic & Domain Model (entities, rules, state machines, roles)
6. API / Data Signals
7. Integrations & Third-Party Services
8. Frontend Agent Spec (component hierarchy, state needs, interactions, design tokens)
9. Backend Agent Spec (data models, endpoints, auth, business rules)
10. Open Questions (anything ambiguous or auth-gated)

Save three files: [app-name]-exploration-report.md, [app-name]-frontend-spec.md, [app-name]-backend-spec.md
`.trim();


// ─── Skill: Website Design Extractor ─────────────────────────────────────────
export const SKILL_DESIGN_EXTRACTOR = `
## Skill: Website Design Extractor

Extract the complete visual design system. Precision is critical — vague outputs are useless.
"Uses a blue color" → bad. "#1A73E8 (primary action buttons, links)" → good.

### Process
1. Navigate to site. Screenshot homepage and key pages.
2. Hover over interactive elements to capture hover states. Capture dark mode if available.
3. Run JS to extract computed styles from h1, h2, h3, p, button, a, input, nav elements:
   window.getComputedStyle(el) → color, backgroundColor, fontFamily, fontSize, fontWeight,
   lineHeight, borderRadius, padding, boxShadow
4. Extract CSS custom properties (design tokens) from :root.
5. Inspect priority components: primary button, nav bar, cards, input fields, hero, footer.
6. Measure container max-width, grid column count, section padding, spacing scale.
7. Convert ALL colors to HEX — rgb(26, 115, 232) → #1A73E8.

### Output Format
Produce a structured design system report covering:
1. Color System — Primary, Secondary, Neutral/Background, Text, Border, Interactive States
2. Typography — Font Families (import source), Type Scale (H1–Caption with all metrics)
3. UI Components — Buttons (primary/secondary/disabled), Cards, Navigation Bar, Input Fields,
   Tables, Modals, Dropdowns, Sidebar
4. Layout System — Container max-width, breakpoints, grid system, spacing scale, section padding
5. Visual Style Notes — animations, icon style, image treatment, loading states
6. CSS Variables / Design Tokens (if found)
7. Replication Checklist

Tips:
- Tailwind sites: infer spacing from class names (p-4 = 16px, gap-6 = 24px)
- CSS-in-JS: check window.__NEXT_DATA__ for theme object
- Always prefer getComputedStyle over authored values
- If you can't find an exact value, say so — don't estimate
`.trim();


// ─── Skill: Website Replicator ────────────────────────────────────────────────
export const SKILL_WEBSITE_REPLICATOR = `
## Skill: Website Replicator

Generate a production-ready Next.js App Router + NestJS full-stack application faithful to the original.
Stack: Next.js 14 App Router | MUI v5 | Redux Toolkit + RTK Query | React Hook Form + Yup | TypeScript

### Phase 1 — Crawl
Navigate → screenshot → extract all internal links → recursive crawl (5 levels deep) →
produce ROUTE_MAP with static/dynamic/protected route separation.

### Phase 2 — Analyze
For each page: identify layout shell (AppBar/Sidebar), component inventory by type (navigation,
data display, input/forms, feedback, layout), read network requests for API endpoints,
map feature flows step-by-step.

### Phase 3 — Generate Frontend
- Map every route → App Router file (app/[route]/page.tsx)
- Create nested layouts at every shell boundary
- Extract visual identity → custom MUI theme (colors, font, border-radius, dark mode)
- Build in priority order: layout shell → auth pages → core data pages → detail pages → shared components
- Wire all interactions: onClick, react-hook-form + yup, useState for modals/tabs/accordions,
  debounced search, filter state, auth guards

### Phase 4 — Redux State
Create feature slices: authSlice (user, token, isAuthenticated), uiSlice (sidebarOpen, activeModal),
notificationSlice. Feature-specific state lives in local useState.

### Phase 5 — RTK Query
- services/api.ts — createApi with baseQuery using NEXT_PUBLIC_API_URL + Bearer token injection
- One feature API file per module (authApi, usersApi, productsApi, dashboardApi)
- Each endpoint: typed params, typed response, providesTags/invalidatesTags for cache management

### Phase 6 — NestJS Backend
- One module per feature domain (auth, users, products, dashboard)
- Each module: controller, service, module, DTOs, entity
- Services return realistic mock data (static arrays with pagination/search logic)
- JWT auth: POST /auth/login → { accessToken, user } → JwtAuthGuard on protected routes
- CORS configured for frontend origin

### Limitations Handling
- Private API → mock service + document in API_CONTRACT.md
- Auth-gated → screenshot before logout + mock auth (admin@example.com / password)
- WebSockets → stub with polling + note in TODO.md
- Third-party embeds → placeholder component

### Deliverables
docs/ROUTE_MAP.md | docs/COMPONENT_MAP.md | docs/API_CONTRACT.md | frontend/ | backend/
`.trim();


// ─── Skill Dispatcher ─────────────────────────────────────────────────────────
export const SKILL_USAGE_GUIDE = `
## When to Use Each Skill

| Trigger | Skill to Activate |
|---|---|
| "explore this app", "map out screens", "crawl this site", URL for cloning | SKILL_DEEP_UI_CRAWLER (run FIRST) |
| "make responsive", "fix on mobile", "broken on small screens" | SKILL_MAKE_RESPONSIVE |
| "explore this site", "document this project", "create a spec", "analyze this URL" | SKILL_PROJECT_EXPLORATION |
| "copy the look", "replicate design", "what colors/fonts", "extract design tokens" | SKILL_DESIGN_EXTRACTOR |
| "replicate this website", "clone this app", "rebuild in Next.js", URL + full app request | SKILL_WEBSITE_REPLICATOR |

### Skill Execution Order for Clone/Replication Tasks
1. SKILL_DEEP_UI_CRAWLER — map all pages and states
2. SKILL_DESIGN_EXTRACTOR — extract visual design system
3. SKILL_PROJECT_EXPLORATION — document business logic and flows
4. SKILL_WEBSITE_REPLICATOR — generate the full application
`.trim();
