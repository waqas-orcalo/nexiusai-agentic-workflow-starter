# Skill: Website Replicator

## When to activate
Trigger on: "replicate this website", "clone this app", "copy this site into Next.js", "rebuild
this site", "reverse engineer this website", "generate a full-stack clone of", "reconstruct this
web app", "mirror this site", "build a Next.js version of", or a URL passed for a full application
(not just a single page or component).

---

## Goal
Crawl any live website and generate a production-ready **Next.js App Router + NestJS** full-stack
application with MUI, Redux Toolkit, and RTK Query — faithful to the original site's UX and flows.

## Quick Overview

| Phase | What Happens |
|---|---|
| 1 | **Crawl** — Recursively discover all pages, routes, and nested flows |
| 2 | **Analyze** — Extract UI components, data shapes, interactions |
| 3 | **Generate Frontend** — Next.js App Router with MUI + RTK Query |
| 4 | **Generate Backend** — NestJS modular API scaffold |
| 5 | **Integrate** — Wire frontend ↔ backend via RTK Query |
| 6 | **Deliver** — Output complete project with setup instructions |

---

## Phase 1 — Deep Website Crawling

### 1.1 Initial Navigation
1. Navigate to the URL
2. Resize window to 1440x900 (desktop viewport)
3. Take a screenshot → visual reference for homepage
4. Get page text → extract all visible text content
5. Read page → get structural HTML for link discovery
6. Read network requests → capture API calls made on load

### 1.2 Link Extraction
Extract ALL internal links from: top nav + dropdowns, sidebar navigation, footer links, CTA buttons,
dashboard tiles, breadcrumbs, pagination controls.

Separate into:
- **Static routes**: `/dashboard`, `/settings/profile`
- **Dynamic routes**: `/products/123` → normalize to `/products/:id`
- **Auth-gated routes**: note if redirect to login occurs

### 1.3 Recursive Crawl
For each discovered link not yet visited:
1. Navigate to the page → screenshot → extract links → add to queue → repeat

Crawl depth: **5 levels deep**. If >50 unique routes, document the pattern and sample-crawl representative routes.

### 1.4 Route Map Output
```
ROUTE MAP
=========
/ (Homepage)
/auth/login
/auth/signup
/auth/forgot-password

/dashboard (protected)
/dashboard/overview
/dashboard/analytics
/dashboard/users
/dashboard/users/[id]
/dashboard/users/[id]/edit
/dashboard/users/create
/dashboard/settings/profile
/dashboard/settings/security

/products
/products/[id]
/products/[id]/reviews
```

---

## Phase 2 — UI Component Extraction

### 2.1 Layout Architecture
Identify the **shell** — the persistent wrapper all pages share:
- Top AppBar? Collapsible sidebar? Both?
- Mobile behavior (hamburger? bottom nav?)
- Multiple shell variants (auth pages have no sidebar?)

### 2.2 Component Inventory
For every page, list every distinct UI component:

- **Navigation**: AppBar, Drawer/Sidebar, Tabs, Breadcrumbs
- **Data Display**: Table, DataGrid, Card, List, Chip, Badge, Avatar, Tooltip
- **Input/Forms**: TextField, Select, Autocomplete, DatePicker, Checkbox, Radio, Switch
- **Feedback**: Alert, Snackbar, LinearProgress, CircularProgress, Skeleton, Dialog
- **Layout**: Grid, Stack, Box, Divider, Accordion, Paper

For each: note data shape, interactive behavior, and whether it appears on multiple pages.

### 2.3 API / Data Detection
Read network requests on each key page to capture: endpoint paths, HTTP methods, response shapes,
auth headers, pagination patterns, filtering/sorting params.

### 2.4 Feature Flow Mapping
```
LOGIN FLOW
  1. /auth/login — email + password form
  2. POST /api/auth/login
  3. Store token in Redux auth slice
  4. Redirect to /dashboard

CREATE USER FLOW
  1. /dashboard/users/create — form
  2. POST /api/users
  3. Optimistic update in user list
  4. Toast success → redirect
```

---

## Phase 3 — Next.js Application Generation

### 3.1 App Router Routing
| Route | File |
|---|---|
| `/` | `app/page.tsx` |
| `/auth/login` | `app/auth/login/page.tsx` |
| `/dashboard` | `app/dashboard/page.tsx` |
| `/dashboard/users` | `app/dashboard/users/page.tsx` |
| `/dashboard/users/[id]` | `app/dashboard/users/[id]/page.tsx` |

### 3.2 Nested Layouts
```
app/layout.tsx              ← Root: ThemeProvider + Redux Provider
app/auth/layout.tsx         ← Auth shell: centered card, no nav
app/dashboard/layout.tsx    ← Dashboard shell: AppBar + Sidebar
app/dashboard/settings/layout.tsx  ← Settings: nested sub-nav tabs
```

### 3.3 Theme
Extract visual identity → create custom MUI theme:
- Primary/secondary/error/warning colors (eyedropper on screenshots)
- Font family (check Google Fonts links in page source)
- Border radius, shadow intensity
- Dark mode support if the original has it

### 3.4 Component Generation Priority
1. Layout shell (AppBar, Sidebar, layout.tsx files)
2. Auth pages (login, signup)
3. Core data pages (main listing pages, dashboards)
4. Detail/edit pages (dynamic routes)
5. Shared reusable components

### 3.5 Interactive Wiring Checklist
- [ ] All buttons have `onClick` handlers
- [ ] All forms use `react-hook-form` with `yup` validation
- [ ] All modals have `useState(open)` managed locally
- [ ] All tables have mock data, pagination state, sort state
- [ ] Search inputs have debounced `onChange`
- [ ] Filters update a `filters` state object passed to RTK Query hooks
- [ ] Tabs and accordions have `activeTab` state
- [ ] Auth guards redirect unauthenticated users

---

## Phase 4 — Redux State Management

Create slices for each feature domain:
```
store/slices/authSlice.ts       ← user, token, isAuthenticated
store/slices/uiSlice.ts         ← sidebarOpen, theme, activeModal
store/slices/notificationSlice.ts ← toast queue
```

Feature-specific state (pagination, filters, selected rows) lives in local `useState`.

---

## Phase 5 — RTK Query API Layer

### Base API
```typescript
// services/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store/store';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['User', 'Product', 'Order', 'Dashboard'],
  endpoints: () => ({}),
});
```

### Feature API Pattern
```typescript
// services/usersApi.ts
export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<PaginatedResponse<User>, { page?: number; limit?: number; search?: string }>({
      query: ({ page = 1, limit = 20, search = '' }) =>
        `/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
      providesTags: (result) =>
        result
          ? [...result.data.map(({ id }) => ({ type: 'User' as const, id })), { type: 'User', id: 'LIST' }]
          : [{ type: 'User', id: 'LIST' }],
    }),
    createUser: builder.mutation<User, CreateUserDto>({
      query: (body) => ({ url: '/users', method: 'POST', body }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
  }),
});
```

---

## Phase 6 — Integration & Delivery

```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001

# backend/.env
PORT=3001
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
```

JWT auth pattern:
1. `POST /auth/login` returns `{ accessToken, user }`
2. Frontend stores token in Redux `authSlice`
3. RTK Query `prepareHeaders` injects `Authorization: Bearer <token>` on every request

---

## Handling Limitations

| Blocker | Solution |
|---|---|
| Private REST API | Mock service returns representative data; document in `API_CONTRACT.md` |
| Auth-gated pages | Screenshot before logout; implement mock auth (`admin@example.com / password`) |
| WebSocket/real-time | Stub with polling or static mock state; note in `TODO.md` |
| Third-party embeds | Placeholder component (e.g. `<MapPlaceholder />`) |
| Payment flows | Mock checkout; document Stripe integration points |

---

## Output Deliverables

| File | Purpose |
|---|---|
| `docs/ROUTE_MAP.md` | Every route, auth requirement, Next.js file path |
| `docs/COMPONENT_MAP.md` | Every reusable component: name, location, props, pages |
| `docs/API_CONTRACT.md` | Every endpoint: method, path, request/response shape, auth |
| `frontend/` | Complete Next.js App Router application |
| `backend/` | Complete NestJS application with mock data |

```bash
# Setup
cd backend && npm install && npm run start:dev   # http://localhost:3001
cd frontend && npm install && npm run dev         # http://localhost:3000
```
