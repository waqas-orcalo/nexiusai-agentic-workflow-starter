# Skill: frontend-task

## Purpose
Build a complete frontend feature in the `frontend/` directory.
Follows Next.js 14 + MUI v5 + RTK Query + React Hook Form + Yup patterns.

## When to Use
- User says "build the frontend for X", "create the UI for X", "implement the frontend"
- `run-workflow` skill delegates frontend work during PARALLEL_DEV step
- Scope is FRONTEND or FULLSTACK

## Always Read First
1. `agents/frontend-agent/AGENT.md` — full rules and patterns
2. `agents/frontend-agent/prompts/system.prompt.ts` — LLM prompt guidelines
3. `agents/types.ts` — TypeScript interfaces

## File Creation Order (follow exactly)

### 1. Scan Existing Frontend
Before creating any files:
```
ls frontend/src/services/
ls frontend/src/store/slices/
ls frontend/src/components/
ls frontend/src/app/(dashboard)/
```
Never duplicate existing files.

### 2. Create RTK Query Service
File: `frontend/src/services/<feature>Api.ts`

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const <feature>Api = createApi({
  reducerPath: '<feature>Api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL + '/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth?.accessToken;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['<Feature>'],
  endpoints: (builder) => ({
    get<Feature>s: builder.query<{ data: <Feature>[]; meta: any }, PaginationParams>({
      query: (params) => ({ url: '/<feature>', params }),
      providesTags: ['<Feature>'],
    }),
    get<Feature>ById: builder.query<{ data: <Feature> }, string>({
      query: (id) => `/<feature>/${id}`,
      providesTags: ['<Feature>'],
    }),
    create<Feature>: builder.mutation<{ data: <Feature> }, Create<Feature>Dto>({
      query: (body) => ({ url: '/<feature>', method: 'POST', body }),
      invalidatesTags: ['<Feature>'],
    }),
    update<Feature>: builder.mutation<{ data: <Feature> }, { id: string; body: Update<Feature>Dto }>({
      query: ({ id, body }) => ({ url: `/<feature>/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['<Feature>'],
    }),
    delete<Feature>: builder.mutation<void, string>({
      query: (id) => ({ url: `/<feature>/${id}`, method: 'DELETE' }),
      invalidatesTags: ['<Feature>'],
    }),
  }),
});
```

### 3. Create Redux Slice
File: `frontend/src/store/slices/<feature>Slice.ts`

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface <Feature>State {
  selected<Feature>Id: string | null;
  filter: { status?: string; search?: string };
  pagination: { page: number; limit: number };
}

const initialState: <Feature>State = {
  selected<Feature>Id: null,
  filter: {},
  pagination: { page: 1, limit: 10 },
};

const <feature>Slice = createSlice({
  name: '<feature>',
  initialState,
  reducers: {
    setSelected<Feature>Id(state, { payload }: PayloadAction<string | null>) {
      state.selected<Feature>Id = payload;
    },
    setFilter(state, { payload }: PayloadAction<typeof initialState.filter>) {
      state.filter = payload;
    },
    setPagination(state, { payload }: PayloadAction<typeof initialState.pagination>) {
      state.pagination = payload;
    },
  },
});
```

### 4. Create Components (Atom → Molecule → Organism)

#### 4a. <Feature>Card (Atom — display a single item)
File: `frontend/src/components/<feature>/<Feature>Card.tsx`
- Renders: title, status chip, action buttons (edit, delete)
- Uses MUI: `Card`, `CardContent`, `CardActions`, `Chip`, `IconButton`
- Props: `item: <Feature>`, `onEdit: () => void`, `onDelete: () => void`

#### 4b. <Feature>List (Molecule — list with loading/error/empty)
File: `frontend/src/components/<feature>/<Feature>List.tsx`
- Uses `useGet<Feature>sQuery` from RTK Query
- Loading state: `<CircularProgress />` or `<Skeleton />`
- Error state: `<Alert severity="error">`
- Empty state: `<Alert severity="info">No items found</Alert>`
- Renders list of `<Feature>Card` components

#### 4c. <Feature>Form (Molecule — create/edit form)
File: `frontend/src/components/<feature>/<Feature>Form.tsx`
- Uses `react-hook-form` + Yup validation schema
- Uses `useCreate<Feature>Mutation` or `useUpdate<Feature>Mutation`
- On success: show toast notification (MUI Snackbar/Alert)
- On error: show error message
- Submit button shows loading state while mutation is running

#### 4d. <Feature>Modal (Organism — wraps form in a dialog)
File: `frontend/src/components/<feature>/<Feature>Modal.tsx`
- Uses MUI `Dialog`, `DialogTitle`, `DialogContent`, `DialogActions`
- Receives `open: boolean`, `onClose: () => void`, `item?: <Feature>`
- Renders `<Feature>Form` inside

### 5. Create Page
File: `frontend/src/app/(dashboard)/<feature>/page.tsx`

```typescript
'use client';
export default function <Feature>Page() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <Box>
      <Typography variant="h4"><Feature>s</Typography>
      <Button onClick={() => setOpen(true)}>Add <Feature></Button>
      <<Feature>List onEdit={(id) => { setSelected(id); setOpen(true); }} />
      <<Feature>Modal open={open} onClose={() => { setOpen(false); setSelected(null); }} itemId={selected} />
    </Box>
  );
}
```

## Hard Rules
1. **NEVER use raw `fetch` or `axios`** — always RTK Query
2. **NEVER put API calls in components** — only in RTK Query services
3. **NEVER hardcode the API URL** — use `process.env.NEXT_PUBLIC_API_URL`
4. **ALWAYS handle loading, error, and empty states** in list components
5. **ALWAYS use Yup schemas** for form validation, not manual checks
6. **ALWAYS use `'use client'`** directive on interactive components
7. **ALWAYS invalidate the correct RTK Query tag** after mutations
8. **ALWAYS use MUI components** — no raw HTML elements for UI

## TypeScript Requirements
- Every component has typed props (`interface ComponentProps`)
- Every API response has typed return (`<Feature>[]`, `{ data: <Feature> }`)
- No `any` types (except for Redux `getState` where unavoidable)

## File Checklist
- [ ] `frontend/src/services/<feature>Api.ts`
- [ ] `frontend/src/store/slices/<feature>Slice.ts`
- [ ] `frontend/src/components/<feature>/<Feature>Card.tsx`
- [ ] `frontend/src/components/<feature>/<Feature>List.tsx`
- [ ] `frontend/src/components/<feature>/<Feature>Form.tsx`
- [ ] `frontend/src/components/<feature>/<Feature>Modal.tsx`
- [ ] `frontend/src/app/(dashboard)/<feature>/page.tsx`
- [ ] Register `<feature>Api` in `frontend/src/store/store.ts`

## Output Report
After completing all files, output:

```
FRONTEND IMPLEMENTATION REPORT
===============================
Feature: <name>
Files Created: 7

FILES:
- frontend/src/services/<feature>Api.ts
- frontend/src/store/slices/<feature>Slice.ts
- frontend/src/components/<feature>/<Feature>Card.tsx
- frontend/src/components/<feature>/<Feature>List.tsx
- frontend/src/components/<feature>/<Feature>Form.tsx
- frontend/src/components/<feature>/<Feature>Modal.tsx
- frontend/src/app/(dashboard)/<feature>/page.tsx

RTK QUERY HOOKS:
- useGet<Feature>sQuery
- useGet<Feature>ByIdQuery
- useCreate<Feature>Mutation
- useUpdate<Feature>Mutation
- useDelete<Feature>Mutation

NEXT STEPS FOR QA:
- Test component rendering
- Test form submission with valid/invalid data
- Test list loading/error/empty states
```
