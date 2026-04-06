# Skill: Deep UI Navigation Crawler

## When to activate
Run this skill FIRST — before any design extraction, component analysis, or replication task.
Trigger on: "explore this app", "map out all the screens", "crawl this site", "find all the pages
and states", or whenever a URL is passed for a clone/replication task.

---

## Goal
Map *everything* a website shows across all its interactive states — not just initial page load,
but every panel, modal, dropdown, tab, drawer, and step revealed by user interaction.

---

## Phase 1 — Initial Page Survey

1. Navigate to the target URL. Take a full-page screenshot (this is your baseline).
2. Collect all navigation entry points (top nav, sidebar, footer, breadcrumbs, tab bars).
3. Run this JS to extract all internal links:

```javascript
const links = Array.from(document.querySelectorAll('a[href]'))
  .map(a => ({ text: a.innerText.trim(), href: a.href }))
  .filter(l => l.href.startsWith(window.location.origin) && l.text);
console.log(JSON.stringify([...new Map(links.map(l => [l.href, l])).values()], null, 2));
```

4. Classify the app type:
   - **Static/marketing site** → light crawl
   - **SPA/dashboard** → medium crawl (explore nav + interactions)
   - **Complex web app** → deep crawl (full interaction mapping)

---

## Phase 2 — Navigation Traversal

Visit each discovered route. For each page:
- Take a screenshot, note URL and page title
- Record primary purpose
- Identify unexplored interactive elements

Running log format:
```
Routes discovered:
  /           → Homepage        (screenshots: 1)
  /dashboard  → Dashboard       (screenshots: 3 — default, sidebar expanded, modal open)
```

---

## Phase 3 — Interactive UI Exploration

For each page, interact with every element that reveals hidden state:

**Dropdowns** — click every `<select>`, custom dropdown, `aria-haspopup` element. Screenshot the open state.

**Modals** — click "Add", "New", "Create", "Edit", "Delete", "Settings", "Upload", "Invite" buttons.
Screenshot each step of multi-step modals.

**Tabs** — click every tab, screenshot the resulting panel.

**Accordions** — expand all collapsed sections (`▶`, `+`, chevrons, `aria-expanded="false"`).

**Hover menus** — hover over nav items, icon buttons, truncated text.

**Side drawers** — hamburger menus, notification bells, user avatar menus.

**Forms** — screenshot empty, filled, and error/validation states.

```javascript
// Find all interactive elements that might reveal hidden UI
const interactive = Array.from(document.querySelectorAll(
  'button, [role="button"], [aria-haspopup], [aria-expanded], details, summary, ' +
  '[data-toggle], [data-modal], .accordion, .dropdown-toggle, .tab, [role="tab"]'
)).map(el => ({
  tag: el.tagName,
  text: el.innerText?.trim().slice(0, 50),
  role: el.getAttribute('role'),
  ariaExpanded: el.getAttribute('aria-expanded'),
  ariaHaspopup: el.getAttribute('aria-haspopup'),
  classes: el.className?.slice(0, 80)
})).filter(el => el.text || el.role);
console.log(JSON.stringify(interactive, null, 2));
```

---

## Phase 4 — Nested Flow Exploration

- **Auth flows** — follow full signup/login flow, screenshot each step
- **Onboarding flows** — "Get started", "Setup", "Welcome" flows
- **Creation/wizard flows** — multi-step "Create new", "Add", "Configure" flows
- **Dashboard interactions** — charts (hover for tooltips), filter controls, date pickers, data tables (sort, paginate, expand rows)
- **Empty and loading states** — screenshot "No items yet" / "Nothing here" screens

---

## Phase 5 — UI Map Output

```
# [Site Name] — UI Navigation Map

## Summary
- Total pages/routes discovered: N
- Total UI states captured: N
- App type: [Static / SPA / Complex Web App]
- Auth required for full access: [Yes / No / Partial]

## Route Map
### / — Homepage
- Key interactions: Header nav dropdown, CTA → signup modal, Pricing accordion

### /dashboard — Dashboard
- Key interactions: Sidebar (8 items, 2 collapsible), Notification bell (3 states),
  Date filter (7d/30d/90d/custom), Data table (sortable, row click → detail panel)

## Interactive Component Inventory

### Modals
| Name / Trigger | Steps | Key Fields |
|---|---|---|

### Dropdowns
| Location | Options | Behavior |
|---|---|---|

### Tab Systems
| Location | Tabs | Default |
|---|---|---|

### Forms
| Location | Fields | Validation | Submit behavior |
|---|---|---|---|

## Nested Flows
### Signup Flow: Step 1 → Step 2 → Step 3 → Dashboard

## Auth-Gated Areas
- /admin — requires admin role

## Recommended Crawl Order for Downstream Skills
1. Homepage (most design signal)
2. Dashboard (richest component variety)
```

---

## Tips
- Prioritize depth over breadth on complex apps
- After clicking SPA nav items, check if URL changed — if not, note as "virtual route"
- Scroll the full page before declaring a route complete (scroll-triggered content)
- For mobile replication: resize to 375px wide and re-screenshot key pages
- If an action requires real credentials or is irreversible — skip it and note why
