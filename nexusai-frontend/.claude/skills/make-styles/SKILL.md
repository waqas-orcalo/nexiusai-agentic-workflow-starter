# Skill: make-styles

Use this skill whenever you need to:
- Create a `styles.ts` file for a new component, module, layout, or page
- Add a new style property to an existing `styles.ts`
- Use theme values or dynamic parameters in styles
- Fix incorrect inline styles in a component (move them to `styles.ts`)

---

## The Golden Rule

**Every component folder must have a co-located `styles.ts` file.**
**No styles are ever written inside `index.tsx`.**

```
ComponentName/
├── index.tsx     ← imports { styles } from './styles'. Never defines styles.
└── styles.ts     ← ALL styles live here. Named export only.
```

---

## styles.ts — Exact Format

```ts
// styles.ts

export const styles = {

  // ── Static style (no theme, no params) ─────────────────────────────────
  wrapper: () => ({
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    p: 3,
    borderRadius: 2,
  }),

  // ── Style that needs MUI theme ──────────────────────────────────────────
  card: (theme: any) => ({
    border: `1px solid ${theme?.palette?.divider}`,
    backgroundColor: theme?.palette?.background?.paper,
    boxShadow: theme?.shadows?.[2],
  }),

  // ── Style that needs a dynamic value ───────────────────────────────────
  statusBadge: (theme: any, status: string) => ({
    backgroundColor:
      status === 'active'   ? theme?.palette?.success?.light :
      status === 'pending'  ? theme?.palette?.warning?.light :
                              theme?.palette?.error?.light,
    color:
      status === 'active'   ? theme?.palette?.success?.dark :
      status === 'pending'  ? theme?.palette?.warning?.dark :
                              theme?.palette?.error?.dark,
    fontSize: '0.75rem',
    fontWeight: 600,
    height: 24,
  }),

  // ── Style with boolean toggle ───────────────────────────────────────────
  navItem: (theme: any, isActive: boolean) => ({
    borderRadius: 1,
    mx: 1,
    mb: 0.5,
    backgroundColor: isActive ? theme?.palette?.primary?.main : 'transparent',
    color: isActive ? theme?.palette?.common?.white : 'inherit',
    '&:hover': {
      backgroundColor: isActive
        ? theme?.palette?.primary?.dark
        : theme?.palette?.action?.hover,
    },
  }),

};
```

### Rules for styles.ts
| Rule | Detail |
|---|---|
| Export | Always `export const styles` — named, never default |
| Value type | Every value is **an arrow function** returning an object |
| No theme needed | `key: () => ({ ... })` |
| Theme needed | `key: (theme: any) => ({ ... })` |
| Dynamic + theme | `key: (theme: any, param: type) => ({ ... })` |
| Static only | `key: (theme: any, param: type) => ({ ... })` — still a function, just ignores args |
| Pseudo-selectors | Write directly inside the object: `'&:hover': { ... }` |
| Child selectors | `'& .MuiDrawer-paper': { ... }` |

---

## index.tsx — How to Consume styles.ts

### When styles do NOT need theme
```tsx
import { styles } from './styles';

const MyComponent = () => (
  <Box sx={styles?.wrapper()}>
    <Typography sx={styles?.title()}>Hello</Typography>
  </Box>
);
```

### When styles need theme
```tsx
import { useTheme } from '@mui/material';
import { styles } from './styles';

const MyComponent = () => {
  const theme = useTheme();

  return (
    <Box sx={styles?.card(theme)}>
      <Typography sx={styles?.heading(theme)}>Hello</Typography>
    </Box>
  );
};
```

### When styles need theme + dynamic value
```tsx
import { useTheme } from '@mui/material';
import { styles } from './styles';

const MyComponent = ({ status, isActive }: Props) => {
  const theme = useTheme();

  return (
    <Chip sx={styles?.statusBadge(theme, status)} label={status} />
    <ListItemButton sx={styles?.navItem(theme, isActive)}>...</ListItemButton>
  );
};
```

### Always use optional chaining
```tsx
// ✅ CORRECT
sx={styles?.wrapper()}
sx={styles?.card(theme)}
sx={styles?.statusBadge(theme, row.status)}

// ❌ WRONG
sx={styles.wrapper()}
sx={{ display: 'flex', gap: 1 }}   // inline — never do this
```

---

## MUI Color Tokens — Use These, Never Hex

Always use MUI theme token strings in sx-compatible values. Only use `theme?.palette` when you need to interpolate into a template literal (e.g., `border: \`1px solid ${theme?.palette?.divider}\``).

```ts
// ✅ CORRECT — token strings (no theme needed)
color: 'text.primary'
color: 'text.secondary'
backgroundColor: 'background.paper'
backgroundColor: 'background.default'
backgroundColor: 'action.hover'
backgroundColor: 'action.selected'
borderColor: 'divider'
color: 'primary.main'
color: 'primary.light'
color: 'primary.dark'
color: 'secondary.main'
color: 'error.main'
color: 'error.light'
color: 'warning.main'
color: 'warning.light'
color: 'success.main'
color: 'success.light'
color: 'info.main'
color: 'info.light'

// ✅ CORRECT — theme object (only when interpolating)
border: `1px solid ${theme?.palette?.divider}`
backgroundColor: theme?.palette?.primary?.light

// ❌ WRONG — hard-coded hex
color: '#333'
backgroundColor: '#fff'
backgroundColor: '#f5f5f5'
```

---

## MUI Spacing — Use Numbers Not px Strings

MUI spacing uses a base of 8px. Pass numbers, not strings.

```ts
// ✅ CORRECT
p: 2        // padding: 16px
p: 3        // padding: 24px
px: 2       // padding-left + right: 16px
py: 1       // padding-top + bottom: 8px
m: 1        // margin: 8px
mb: 2       // margin-bottom: 16px
mt: 3       // margin-top: 24px
gap: 1      // gap: 8px
gap: 2      // gap: 16px

// ❌ WRONG
p: '16px'
mb: '24px'
gap: '8px'
```

---

## Typography Values

```ts
// Font weights
fontWeight: 400   // regular
fontWeight: 500   // medium
fontWeight: 600   // semibold
fontWeight: 700   // bold

// Font sizes (rem)
fontSize: '0.75rem'   // 12px — captions, labels, chips
fontSize: '0.875rem'  // 14px — body small, nav items
fontSize: '1rem'      // 16px — body
fontSize: '1.125rem'  // 18px — subtitle
fontSize: '1.25rem'   // 20px — heading small
fontSize: '1.5rem'    // 24px — heading medium
fontSize: '2rem'      // 32px — heading large, stats

// Text transform
textTransform: 'none'       // ← always for buttons
textTransform: 'uppercase'  // ← for column headers

// Text align
textAlign: 'center'
textAlign: 'left'
textAlign: 'right'
```

---

## Responsive Styles

Use object syntax for breakpoints directly inside any style property:

```ts
// Responsive font size
title: () => ({
  fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
  fontWeight: 700,
}),

// Responsive display
sidebar: () => ({
  display: { xs: 'none', md: 'flex' },
  flexDirection: 'column',
}),

// Responsive padding
container: () => ({
  px: { xs: 2, sm: 3, md: 4 },
  py: { xs: 2, md: 3 },
}),

// Responsive grid
grid: () => ({
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(2, 1fr)',
    md: 'repeat(3, 1fr)',
    lg: 'repeat(4, 1fr)',
  },
  gap: 2,
}),
```

---

## Pseudo-selectors and Nested Selectors

Write all pseudo-classes, pseudo-elements, and child selectors directly inside the style object:

```ts
tableRow: () => ({
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'action.hover',
  },
  '&.Mui-selected': {
    backgroundColor: 'action.selected',
  },
  '&:last-child td': {
    border: 0,
  },
}),

// Targeting MUI internals
drawer: () => ({
  width: 240,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: 240,
    boxSizing: 'border-box',
    borderRight: '1px solid',
    borderColor: 'divider',
  },
}),

// Hover revealing a child element
fieldWrapper: () => ({
  position: 'relative',
  '&:hover .field-actions': {
    opacity: 1,
    visibility: 'visible',
  },
}),

fieldActions: () => ({
  opacity: 0,
  visibility: 'hidden',
  transition: 'opacity 0.2s ease',
}),
```

---

## Common Layout Patterns

Copy-paste these into `styles.ts` as needed:

```ts
// Page wrapper
wrapper: () => ({
  width: '100%',
}),

// Centered container
centered: () => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}),

// Full-height centered (login page)
fullHeightCentered: () => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
}),

// Row with space-between
spaceBetween: () => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}),

// Card
card: () => ({
  borderRadius: 2,
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  backgroundColor: 'background.paper',
  p: 3,
}),

// Form column
form: () => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 0,    // gap is controlled per-field via mb in CustomTextField
}),

// Action buttons row
buttonRow: () => ({
  display: 'flex',
  gap: 1,
  justifyContent: 'flex-end',
}),

// AppBar
appBar: (theme: any) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme?.palette?.common?.white,
  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  color: 'text.primary',
}),
```

---

## Chip / Badge Status Colors Pattern

The most common dynamic style in this project — status and level chips:

```ts
// Single status
statusChip: (theme: any, status: string) => ({
  backgroundColor:
    status === 'active'    ? theme?.palette?.success?.light :
    status === 'inactive'  ? theme?.palette?.warning?.light :
    status === 'blocked'   ? theme?.palette?.error?.light   :
                             theme?.palette?.grey?.[200],
  color:
    status === 'active'    ? theme?.palette?.success?.dark :
    status === 'inactive'  ? theme?.palette?.warning?.dark :
    status === 'blocked'   ? theme?.palette?.error?.dark   :
                             theme?.palette?.text?.secondary,
  fontSize: '0.75rem',
  fontWeight: 600,
  height: 24,
  textTransform: 'capitalize',
}),

// Level chip (beginner / intermediate / advanced)
levelChip: (theme: any, level: string) => ({
  backgroundColor:
    level === 'beginner'     ? theme?.palette?.success?.light :
    level === 'intermediate' ? theme?.palette?.warning?.light :
                               theme?.palette?.error?.light,
  color:
    level === 'beginner'     ? theme?.palette?.success?.dark :
    level === 'intermediate' ? theme?.palette?.warning?.dark :
                               theme?.palette?.error?.dark,
  fontSize: '0.75rem',
  fontWeight: 600,
  height: 24,
}),
```

Usage in component:
```tsx
<Chip label={row.status} size="small" sx={styles?.statusChip(theme, row.status)} />
<Chip label={row.level}  size="small" sx={styles?.levelChip(theme, row.level)} />
```

---

## Migrating Inline Styles to styles.ts

If you find a component that still has inline styles, migrate them:

```tsx
// ❌ BEFORE — inline in index.tsx
const MyComponent = () => (
  <Box sx={{ display: 'flex', gap: 2, p: 3, borderRadius: 2 }}>
    <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>Title</Typography>
  </Box>
);

// ✅ AFTER — step 1: create styles.ts
// styles.ts
export const styles = {
  container: () => ({
    display: 'flex',
    gap: 2,
    p: 3,
    borderRadius: 2,
  }),
  title: () => ({
    fontWeight: 700,
    color: 'text.primary',
  }),
};

// ✅ AFTER — step 2: update index.tsx
import { styles } from './styles';

const MyComponent = () => (
  <Box sx={styles?.container()}>
    <Typography sx={styles?.title()}>Title</Typography>
  </Box>
);
```

---

## Checklist — Every styles.ts File

- [ ] File is named exactly `styles.ts` (not `style.ts`, not `styles.tsx`)
- [ ] File is in the **same folder** as its `index.tsx`
- [ ] Uses `export const styles` — named export, not default
- [ ] Every value is a function returning an object: `key: () => ({ ... })`
- [ ] No hard-coded hex colors — use token strings or `theme?.palette`
- [ ] No px strings for spacing — use MUI number units
- [ ] Dynamic styles accept `(theme: any, param: type)` signature
- [ ] Optional chaining used in component when calling: `styles?.key()`
- [ ] `useTheme()` imported in component only if any style uses theme param
