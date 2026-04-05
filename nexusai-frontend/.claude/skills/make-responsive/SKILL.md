# Skill: make-responsive

Use this skill whenever you need to:
- Make a component, layout, or page responsive
- Add mobile/tablet/desktop breakpoint behavior
- Show or hide elements at specific screen sizes
- Build a responsive sidebar/drawer layout
- Make a Grid layout adapt across screen sizes
- Use the `useResponsive` hook for conditional rendering

---

## MUI Breakpoints Reference

| Key | Min Width | Device |
|-----|-----------|--------|
| `xs` | 0px | Mobile (default — all sizes) |
| `sm` | 600px | Large mobile / small tablet |
| `md` | 900px | Tablet / small laptop |
| `lg` | 1200px | Desktop |
| `xl` | 1536px | Large desktop |

---

## Pattern 1 — Responsive Values in styles.ts (Primary Pattern)

Add breakpoint object syntax directly inside any style property. This is the preferred approach — no JS logic required.

```ts
// styles.ts
export const styles = {

  // Responsive display (show/hide)
  desktopOnly: () => ({
    display: { xs: 'none', md: 'block' },    // hidden on mobile, visible on md+
  }),
  mobileOnly: () => ({
    display: { xs: 'flex', md: 'none' },     // visible on mobile, hidden on md+
  }),

  // Responsive padding/spacing
  container: () => ({
    px: { xs: 2, sm: 3, md: 4 },
    py: { xs: 2, md: 3 },
  }),

  // Responsive font size
  title: () => ({
    fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
    fontWeight: 700,
  }),

  // Responsive flex direction (stack on mobile, row on desktop)
  row: () => ({
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    gap: { xs: 1, md: 2 },
    alignItems: { xs: 'stretch', md: 'center' },
  }),

  // Responsive width
  card: () => ({
    width: { xs: '100%', sm: '50%', md: '33%' },
    p: { xs: 2, md: 3 },
    borderRadius: 2,
  }),

  // AppBar responsive (account for permanent sidebar on desktop)
  appBar: (theme: any, drawerWidth: number) => ({
    zIndex: theme.zIndex.drawer + 1,
    width: { md: `calc(100% - ${drawerWidth}px)` },
    ml: { md: `${drawerWidth}px` },
    backgroundColor: theme?.palette?.common?.white,
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    color: 'text.primary',
  }),

  // Main content area (offset from sidebar on desktop)
  mainContent: (drawerWidth: number) => ({
    flexGrow: 1,
    p: { xs: 2, md: 3 },
    width: { md: `calc(100% - ${drawerWidth}px)` },
  }),

};
```

---

## Pattern 2 — useResponsive Hook (For Conditional Rendering)

Use `useResponsive` when you need to **conditionally render different JSX** based on screen size (not just show/hide with CSS).

**File:** `src/hooks/useResponsive.tsx` — already in the project.

```tsx
import useResponsive from '@/hooks/useResponsive';

const MyComponent = () => {
  const isMobile  = useResponsive('down', 'md');   // true when < 900px
  const isDesktop = useResponsive('up', 'md');     // true when >= 900px
  const isTablet  = useResponsive('between', 'sm', 'md');  // true between 600-900px

  return (
    <Box>
      {isMobile  && <MobileMenu />}
      {isDesktop && <DesktopSidebar />}
    </Box>
  );
};
```

**useResponsive API:**
```ts
useResponsive('up',      'md')           // screen width >= 900px
useResponsive('down',    'md')           // screen width < 900px
useResponsive('only',    'sm')           // screen width is exactly sm range
useResponsive('between', 'sm', 'lg')     // screen width between 600px–1200px
```

**When to use `display` in styles.ts vs `useResponsive`:**
| Situation | Use |
|---|---|
| Show/hide an element visually | `display: { xs: 'none', md: 'block' }` in `styles.ts` |
| Render completely different JSX | `useResponsive` hook |
| Change layout direction, padding, size | `sx` with breakpoint objects in `styles.ts` |
| Trigger logic / effects based on screen size | `useResponsive` hook |

---

## Pattern 3 — Responsive Sidebar (Dual Drawer)

The reference project pattern: render **two drawers** — one for mobile (`temporary`), one for desktop (`permanent`). Visibility is controlled via `display` in `styles.ts`.

```ts
// layout/Sidebar/styles.ts
const DRAWER_WIDTH = 240;

export const styles = {
  // Desktop: permanent, visible on md+
  desktopDrawer: () => ({
    display: { xs: 'none', md: 'block' },
    width: DRAWER_WIDTH,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: DRAWER_WIDTH,
      boxSizing: 'border-box',
      borderRight: '1px solid',
      borderColor: 'divider',
    },
  }),

  // Mobile: temporary modal drawer, visible on xs–sm only
  mobileDrawer: () => ({
    display: { xs: 'block', md: 'none' },
    '& .MuiDrawer-paper': {
      width: DRAWER_WIDTH,
      boxSizing: 'border-box',
    },
  }),

  navItem: () => ({
    borderRadius: 1,
    mx: 1,
    mb: 0.5,
  }),
  activeItem: () => ({
    backgroundColor: 'primary.main',
    color: '#fff',
    '&:hover': { backgroundColor: 'primary.dark' },
    '& .MuiListItemIcon-root': { color: '#fff' },
  }),
  inactiveItem: () => ({
    '&:hover': { backgroundColor: 'action.hover' },
  }),
};
```

```tsx
// layout/Sidebar/index.tsx
'use client';
import { Drawer } from '@mui/material';
import { useState } from 'react';
import { styles } from './styles';

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleToggle = () => setMobileOpen((prev) => !prev);

  const drawerContent = (
    <List>
      {NAV_ITEMS.map((item) => ( /* ...nav items */ ))}
    </List>
  );

  return (
    <>
      {/* Mobile: temporary (modal, closes on click outside) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleToggle}
        ModalProps={{ keepMounted: true }}   // Better mobile performance
        sx={styles?.mobileDrawer()}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop: permanent (always visible) */}
      <Drawer
        variant="permanent"
        sx={styles?.desktopDrawer()}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};
```

**Header must pass `onMenuToggle` to open the mobile drawer:**
```tsx
// layout/Header/index.tsx — pass toggle prop to Sidebar
const [mobileOpen, setMobileOpen] = useState(false);

<AppBar sx={styles?.appBar(theme, DRAWER_WIDTH)}>
  <IconButton
    sx={{ display: { md: 'none' } }}   // Only show hamburger on mobile
    onClick={() => setMobileOpen(true)}
  >
    <MenuIcon />
  </IconButton>
</AppBar>

<Sidebar mobileOpen={mobileOpen} onToggle={() => setMobileOpen(false)} />
```

---

## Pattern 4 — Responsive Grid Layouts

Use MUI `Grid` with breakpoint column props. Total columns = 12.

```tsx
import { Grid } from '@mui/material';

// Stats cards — 1 column mobile, 2 tablet, 4 desktop
<Grid container spacing={2}>
  <Grid item xs={12} sm={6} md={3}>
    <StatCard />
  </Grid>
  <Grid item xs={12} sm={6} md={3}>
    <StatCard />
  </Grid>
</Grid>

// Form fields — full width mobile, half width desktop
<Grid container spacing={2}>
  <Grid item xs={12} md={6}>
    <CustomTextField name="firstName" ... />
  </Grid>
  <Grid item xs={12} md={6}>
    <CustomTextField name="lastName" ... />
  </Grid>
  <Grid item xs={12}>
    <CustomTextField name="email" ... />
  </Grid>
</Grid>

// List/cards — 1 col mobile, 2 col tablet, 3 col desktop
<Grid container spacing={2}>
  {items.map((item) => (
    <Grid item key={item._id} xs={12} sm={6} lg={4}>
      <ItemCard item={item} />
    </Grid>
  ))}
</Grid>
```

**Common column breakpoint patterns:**

| Layout | xs | sm | md | lg |
|--------|----|----|----|----|
| Full width always | 12 | 12 | 12 | 12 |
| Half on desktop | 12 | 12 | 6 | 6 |
| Thirds on desktop | 12 | 6 | 4 | 4 |
| Quarters on desktop | 12 | 6 | 3 | 3 |
| Sidebar layout | 12 | 12 | 4 | 3 |
| Main content area | 12 | 12 | 8 | 9 |

---

## Pattern 5 — Responsive Modals/Dialogs

Dialogs are responsive by default using `fullWidth` + `maxWidth`. On mobile they expand to fill the screen.

```tsx
// Standard responsive modal
<Dialog
  open={open}
  onClose={onClose}
  maxWidth="sm"      // xs | sm | md | lg | xl
  fullWidth          // Always set to true for responsiveness
  PaperProps={{
    sx: {
      borderRadius: { xs: 0, sm: 2 },   // No border radius on mobile (fullscreen feel)
      m: { xs: 0, sm: 2 },              // No margin on mobile
      width: { xs: '100%', sm: 'auto' },
    }
  }}
>
```

---

## Pattern 6 — Responsive Typography

Instead of fixed font sizes, use breakpoint objects:

```ts
// In styles.ts
pageTitle: () => ({
  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
  fontWeight: 700,
  lineHeight: 1.2,
}),
sectionTitle: () => ({
  fontSize: { xs: '1rem', md: '1.25rem' },
  fontWeight: 600,
}),
bodyText: () => ({
  fontSize: { xs: '0.8125rem', md: '0.875rem' },
  color: 'text.secondary',
}),
```

---

## Pattern 7 — Responsive Table (Horizontal Scroll on Mobile)

Tables need a horizontal scroll wrapper on mobile:

```tsx
// In styles.ts
tableWrapper: () => ({
  width: '100%',
  overflowX: 'auto',   // Horizontal scroll on small screens
  '-webkit-overflow-scrolling': 'touch',
}),
```

```tsx
// In component
<Box sx={styles?.tableWrapper()}>
  <CustomTable ... />
</Box>
```

---

## Pattern 8 — Responsive Padding / Spacing Quick Reference

```ts
// Standard page wrapper
wrapper: () => ({
  px: { xs: 2, sm: 3, md: 4 },
  py: { xs: 2, md: 3 },
  maxWidth: '100%',
}),

// Card internal padding
cardContent: () => ({
  p: { xs: 2, md: 3 },
}),

// Action bar (filters + buttons row)
actionBar: () => ({
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  gap: { xs: 1, sm: 2 },
  alignItems: { xs: 'stretch', sm: 'center' },
  justifyContent: 'space-between',
  mb: 2,
}),

// Form field spacing inside a modal
formField: () => ({
  mb: 2,
  width: '100%',
}),
```

---

## Breakpoint Cheat Sheet

```ts
// Show on desktop, hide on mobile
display: { xs: 'none', md: 'block' }
display: { xs: 'none', md: 'flex' }

// Show on mobile, hide on desktop
display: { xs: 'block', md: 'none' }
display: { xs: 'flex', md: 'none' }

// Stack on mobile, row on desktop
flexDirection: { xs: 'column', md: 'row' }

// Full width on mobile, auto on desktop
width: { xs: '100%', md: 'auto' }

// Responsive font
fontSize: { xs: '0.875rem', md: '1rem' }

// Responsive grid
gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }

// Responsive padding
px: { xs: 2, sm: 3, md: 4 }

// Responsive gap
gap: { xs: 1, sm: 2, md: 3 }
```

---

## Checklist — Responsive Component

- [ ] All spacing/padding uses breakpoint objects where needed: `px: { xs: 2, md: 3 }`
- [ ] No fixed pixel widths on containers — use `%`, `100%`, or responsive values
- [ ] Show/hide elements use `display: { xs: 'none', md: 'block' }` — NOT `Hidden` component
- [ ] Sidebar has dual drawer pattern (temporary for mobile, permanent for desktop)
- [ ] AppBar accounts for sidebar width on md+: `width: { md: \`calc(100% - ${drawerWidth}px)\` }`
- [ ] Hamburger menu icon only visible on mobile: `display: { xs: 'flex', md: 'none' }`
- [ ] Grid layouts use breakpoint column props: `xs={12} sm={6} md={4}`
- [ ] Tables are wrapped in `overflowX: 'auto'` container
- [ ] Dialogs always use `fullWidth` prop
- [ ] Font sizes use breakpoint objects for headings and key text
- [ ] `useResponsive` hook used only for conditional JSX — not for CSS-only changes
- [ ] All responsive values are in `styles.ts` — never inline in JSX
