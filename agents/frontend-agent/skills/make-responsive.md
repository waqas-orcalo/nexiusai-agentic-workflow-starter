# Skill: Make Responsive

## When to activate
Trigger when the user asks to: make the app responsive, add mobile support, fix layout on small
screens, make it work on phones/tablets, add breakpoints, or says "it looks broken on mobile".
Designed for codebases using inline React styles (`style={{ }}`).

---

## Core Philosophy
Inline styles are the source of truth for desktop design. **Do NOT modify them.**
CSS classes + media queries are the override layer that adapts layout for smaller screens.

The only two changes this skill makes:
1. Add `className` props to JSX elements (additive — never replace existing `style` props)
2. Write `@media` rules in `globals.css`

---

## Step-by-Step Process

### Step 1 — Explore and Orient
1. Find the global stylesheet (`src/app/globals.css`, `src/styles/globals.css`, or similar).
2. Read the target page/component file(s). Identify:
   - Overall layout type (sidebar + main? card grid? full-width table?)
   - Elements with hardcoded pixel widths, flex rows, overflow, or padding
   - What will cause horizontal scroll or overlap on small screens
3. Check for an existing class naming convention (e.g., `t-` for trainer, `l-` for learner, `a-` for admin). Follow it. If none, use a short prefix based on the page name.

### Step 2 — Plan Breakpoints

| Breakpoint   | Max-width | What changes                                          |
|---|---|---|
| Tablet       | `1024px`  | Sidebars collapse, fonts shrink slightly              |
| Mobile       | `768px`   | Stacked layouts, full-width elements, hidden columns  |
| Small mobile | `480px`   | Extra padding reduction, smaller text                 |

Only add the breakpoints you actually need.

### Step 3 — Identify Problem Elements

| Problem | Fix |
|---|---|
| Fixed-width containers (`width: 900px`) | Add class → `width: 100%` on mobile |
| Side-by-side flex rows | Add class → `flex-direction: column` on mobile |
| Fixed sidebar (`width: 240px`) | Hamburger + off-canvas drawer pattern |
| Wide data tables | Horizontal scroll wrapper or hide secondary columns |
| Hardcoded paddings (`padding: '40px 60px'`) | Reduce on mobile via class |
| Multi-column filter bars | Stack vertically on mobile |

### Step 4 — Add Class Names

Rules:
- **Never remove or modify the existing `style` prop**
- Use descriptive role-based names: `t-tasks-filter-bar`, `l-course-grid`, `a-user-table-wrapper`
- For elements with existing `className`, append: `` className={`existing-class t-new-class`} ``

**Before:**
```jsx
<div style={{ display: 'flex', gap: 16, padding: '24px 40px', background: '#fff' }}>
```
**After:**
```jsx
<div className="t-filter-bar" style={{ display: 'flex', gap: 16, padding: '24px 40px', background: '#fff' }}>
```

### Step 5 — Write Media Queries in globals.css

Add a labeled section at the bottom of globals.css:

```css
/* ── [Page Name] Responsive ──────────────────────────────── */

@media (max-width: 1024px) {
  .t-sidebar { width: 200px; }
}

@media (max-width: 768px) {
  .t-sidebar {
    position: fixed;
    left: -260px;
    top: 0;
    height: 100vh;
    z-index: 200;
    transition: left 0.25s ease;
    width: 260px;
  }
  .t-sidebar.open { left: 0; }

  .t-filter-bar {
    flex-direction: column !important;
    align-items: flex-start !important;
  }
  .t-filter-bar > * { width: 100%; }

  .t-main-content { padding: 16px !important; }
}

@media (max-width: 480px) {
  .t-page-title { font-size: 18px !important; }
}
```

**CSS rules:**
- Use `!important` only when overriding inline styles — acceptable here
- Never use `>` child combinator in a `<style>` JSX tag (SSR hydration error) — always use `globals.css`
- Never use `@apply` unless Tailwind PostCSS is set up

### Step 6 — Handle Mobile Sidebars

Add state: `const [sidebarOpen, setSidebarOpen] = useState(false)`

```css
.t-mobile-menu-btn { display: none; }
.t-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 199; }

@media (max-width: 768px) {
  .t-mobile-menu-btn { display: flex; align-items: center; justify-content: center; }
  .t-sidebar { position: fixed; left: -280px; transition: left 0.25s; z-index: 200; }
  .t-sidebar.open { left: 0; }
  .t-overlay.visible { display: block; }
  .t-main-content { margin-left: 0 !important; }
}
```

### Step 7 — Handle Tables

Option 1 — Horizontal scroll wrapper:
```css
.t-table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
```

Option 2 — Hide secondary columns:
```css
@media (max-width: 768px) { .t-col-secondary { display: none; } }
```

---

## What NOT to Do
- Do **not** change `onClick`, `onChange`, `onSubmit`, or other event handlers
- Do **not** change state variables, hooks, or data fetching logic
- Do **not** change component props or their types
- Do **not** add Tailwind classes unless already in use
- Do **not** modify the inline `style` prop values
- Do **not** put responsive CSS in a `<style>` JSX tag

---

## Checklist Before Finishing
- [ ] No existing `style` props were modified
- [ ] No JS logic, state, or event handlers were changed
- [ ] All new CSS is in `globals.css`
- [ ] Class names follow the project's naming prefix convention
- [ ] Tables have scroll wrappers or hidden columns
- [ ] Mobile sidebar has hamburger button and overlay
- [ ] No `>` child combinators in JSX `<style>` tags
