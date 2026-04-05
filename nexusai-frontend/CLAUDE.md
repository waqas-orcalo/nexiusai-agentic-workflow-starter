# AAC Frontend Starter — CLAUDE.md

This is the **single source of truth** for all conventions, patterns, and rules in this project.
Read this file completely before writing or editing any code.

---

## Stack

| Layer | Library |
|---|---|
| Framework | Next.js 14 (App Router) |
| UI | MUI v5 (`@mui/material`, `@mui/icons-material`) |
| Global State | Redux Toolkit (`@reduxjs/toolkit`) |
| Server State / API | RTK Query (`createApi`, `injectEndpoints`) |
| Forms | React Hook Form + Yup |
| Notifications | notistack (`enqueueSnackbar`) |
| Auth token storage | `sessionStorage` |

---

## Skills Available

| Skill | When to use |
|---|---|
| `make-module` | Adding any new feature module (e.g. Products, Orders, Categories) |
| `make-api-service` | Adding a new RTK Query service file |
| `make-component` | Adding a new reusable common component |
| `make-styles` | Creating or editing a `styles.ts` file — color tokens, spacing, theme usage, dynamic/conditional styles, responsive values, pseudo-selectors |
| `make-responsive` | Making any component, layout, or page responsive — breakpoints, dual sidebar drawer, responsive Grid, useResponsive hook, show/hide at breakpoints |

**Always read the relevant skill before writing any code.**

---

## Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout — providers only
│   ├── page.tsx                # Root redirect
│   ├── (auth)/                 # Public route group
│   │   ├── layout.tsx
│   │   └── login/page.tsx
│   └── (dashboard)/            # Protected route group
│       ├── layout.tsx          # AuthGuard + MainLayout
│       ├── dashboard/page.tsx
│       ├── users/page.tsx
│       └── courses/page.tsx
│
├── components/                 # Shared, reusable UI components
│   ├── CustomTable/index.tsx
│   ├── CustomModal/index.tsx
│   ├── CustomButton/index.tsx
│   ├── PageHeader/index.tsx
│   ├── ConfirmDialog/index.tsx
│   ├── LoadingSpinner/index.tsx
│   ├── EmptyState/index.tsx
│   └── FormFields/
│       ├── index.tsx           # Re-exports all form fields
│       ├── CustomTextField/index.tsx
│       └── CustomSelect/index.tsx
│
├── modules/                    # Feature modules (one folder per domain)
│   ├── users/
│   │   ├── hooks/
│   │   │   └── useGetUsersList.tsx
│   │   ├── UsersList/index.tsx # Table + CRUD actions
│   │   └── UserForm/index.tsx  # Create/Edit modal
│   └── courses/
│       ├── hooks/
│       │   └── useGetCoursesList.tsx
│       ├── CoursesList/index.tsx
│       └── CourseForm/index.tsx
│
├── services/                   # RTK Query API endpoints
│   ├── base-api/index.tsx      # createApi + prepareHeaders + clearApiCache
│   ├── auth/index.ts
│   ├── users/index.ts
│   └── courses/index.ts
│
├── redux/
│   ├── store.ts
│   └── slices/
│       ├── auth/slice.ts
│       ├── users/
│       │   ├── slice.ts
│       │   ├── reducers.ts
│       │   └── selectors.ts
│       └── courses/
│           ├── slice.ts
│           ├── reducers.ts
│           └── selectors.ts
│
├── constants/
│   ├── index.ts        # ROUTES, enums (USER_ROLES, COURSE_STATUS, etc.)
│   ├── api.ts          # API_ENDPOINTS
│   ├── validation.ts   # Yup schemas
│   ├── messages.ts     # SUCCESS_MESSAGES, ERROR_MESSAGES
│   ├── snackbar.ts     # NOTISTACK_VARIANTS
│   └── strings.ts      # AUTH_TOKEN_BYPASS_API
│
├── types/
│   ├── shared/index.ts          # ApiResponse<T>, PaginatedResponse<T>
│   └── modules/
│       ├── users.ts
│       └── courses.ts
│
├── contexts/
│   └── AuthContext.tsx
│
├── GuardsAndPermissions/
│   └── AuthGuard.tsx
│
├── layout/
│   ├── MainLayout/index.tsx
│   ├── Sidebar/index.tsx
│   └── Header/index.tsx
│
├── providers/
│   └── ReduxProvider.tsx
│
├── hooks/
│   ├── useAuth.tsx
│   ├── useToggle.tsx
│   └── useResponsive.tsx
│
├── utils/
│   ├── index.ts        # isNullOrEmpty, setSession, getSession, etc.
│   └── api.ts          # successSnackbar, errorSnackbar, getErrorMessage
│
├── theme/index.tsx
├── config.ts           # BASE_URL, PAGINATION
└── styles/globals.css
```

---

## Hard Rules — NEVER Break These

### 1. No Hard-Coded Strings or Values
Every string used more than once **must** live in a constant file.

```ts
// ❌ WRONG
headers.set('Authorization', `Bearer ${token}`);
fetch('/users?page=1&limit=10');
enqueueSnackbar('User created successfully', { variant: 'success' });

// ✅ CORRECT
import { API_ENDPOINTS } from '@/constants/api';
import { SUCCESS_MESSAGES } from '@/constants/messages';
import { NOTISTACK_VARIANTS } from '@/constants/snackbar';
import { PAGINATION } from '@/config';
```

Constant file for each concern:
- `constants/index.ts` → ROUTES, USER_ROLES, USER_STATUS, COURSE_LEVEL, COURSE_STATUS, API_STATUS
- `constants/api.ts` → API_ENDPOINTS (all HTTP paths)
- `constants/validation.ts` → all yup schemas
- `constants/messages.ts` → SUCCESS_MESSAGES, ERROR_MESSAGES
- `constants/snackbar.ts` → NOTISTACK_VARIANTS
- `config.ts` → BASE_URL, PAGINATION

### 2. Always Arrow Functions — Never `function` Keyword

```tsx
// ❌ WRONG
function UsersList() { ... }

// ✅ CORRECT
const UsersList = () => { ... };
export default UsersList;
```

### 3. Always `@/` Absolute Imports — Never Relative `../`

```tsx
// ❌ WRONG
import CustomTable from '../../components/CustomTable';

// ✅ CORRECT
import CustomTable from '@/components/CustomTable';
```

### 4. Styles Always in a Separate `styles.ts` File

Every component, module, layout, and page **must** have a co-located `styles.ts` file. Never define the `styles` object inside `index.tsx`.

**File structure:**
```
ComponentName/
├── index.tsx       ← imports { styles } from './styles'
└── styles.ts       ← exports const styles = { ... }
```

**styles.ts format — named export, each value is a function:**
```ts
// styles.ts
export const styles = {
  wrapper: () => ({
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  }),
  title: () => ({
    fontWeight: 700,
    color: 'text.primary',
  }),
  // When theme tokens are needed, accept theme as first param:
  activeItem: (theme: any) => ({
    backgroundColor: theme?.palette?.primary?.main,
    color: theme?.palette?.common?.white,
  }),
  // When dynamic values are needed, accept extra params:
  statusChip: (theme: any, status: string) => ({
    backgroundColor: status === 'active' ? theme?.palette?.success?.light : theme?.palette?.warning?.light,
    color: status === 'active' ? theme?.palette?.success?.dark : theme?.palette?.warning?.dark,
  }),
};
```

**index.tsx — import and call with optional chaining:**
```tsx
// index.tsx
import { useTheme } from '@mui/material';
import { styles } from './styles';

const MyComponent = () => {
  const theme = useTheme();   // only needed if styles use theme

  return (
    <Box sx={styles?.wrapper()}>
      <Typography sx={styles?.title()}>Hello</Typography>
      <Box sx={styles?.activeItem(theme)}>Active</Box>
      <Chip sx={styles?.statusChip(theme, row.status)} />
    </Box>
  );
};
```

**Rules:**
- Always `export const styles` — named export, never default
- Every value is an **arrow function** returning an object: `key: () => ({ ... })`
- Use optional chaining when calling: `styles?.propertyName()`
- If a style needs theme values, inject `useTheme()` in the component and pass it: `styles?.propertyName(theme)`
- If a style needs a dynamic value (e.g. status), pass it as a parameter: `styles?.statusChip(theme, row.status)`
- Never use inline `sx={{ ... }}` with complex values inside JSX — always use `styles`

### 5. PascalCase Folders + `index.tsx` Files

```
✅ components/CustomTable/index.tsx
✅ modules/users/UsersList/index.tsx
✅ modules/users/UserForm/index.tsx
❌ components/customTable.tsx
❌ modules/users/userslist/index.tsx
```

### 6. `'use client'` on All Interactive Components

Any component using `useState`, `useEffect`, `useDispatch`, `useSelector`, event handlers, or MUI components **must** have `'use client'` as the very first line.

```tsx
// ✅ CORRECT
'use client';
import { useState } from 'react';
```

### 7. UI Logic Must Be Separated into Hooks

The component file handles only JSX rendering. All API calls, Redux state access, and side effects live in a dedicated hook.

```
modules/users/hooks/useGetUsersList.tsx   ← data fetching + state
modules/users/UsersList/index.tsx         ← JSX only, consumes the hook
```

---

## Folder & File Naming Rules

| Type | Convention | Example |
|---|---|---|
| Component folder | PascalCase | `CustomTable/` |
| Component file | `index.tsx` | `CustomTable/index.tsx` |
| Hook file | camelCase `use` prefix | `useGetUsersList.tsx` |
| Service file | `index.ts` | `services/users/index.ts` |
| Slice file | `slice.ts` / `reducers.ts` / `selectors.ts` | — |
| Type file | camelCase | `users.ts`, `courses.ts` |
| Constant file | camelCase | `api.ts`, `validation.ts` |
| Page file | `page.tsx` (Next.js App Router) | `users/page.tsx` |
| Layout file | `layout.tsx` | `(dashboard)/layout.tsx` |

---

## Module Architecture Pattern

Every feature module follows the exact same structure:

```
src/modules/[moduleName]/
├── hooks/
│   └── useGet[ModuleName]List.tsx     ← RTK Query + Redux pagination state
├── [ModuleName]List/
│   └── index.tsx                      ← Table + create/edit/delete actions
└── [ModuleName]Form/
    └── index.tsx                      ← Create/Edit modal with react-hook-form
```

**Step order when adding a new module:**
1. Add types in `src/types/modules/[module].ts`
2. Add API endpoints in `src/constants/api.ts`
3. Add ROUTES in `src/constants/index.ts`
4. Add success/error messages in `src/constants/messages.ts`
5. Add Yup schemas in `src/constants/validation.ts`
6. Add status/role enums if needed in `src/constants/index.ts`
7. Create RTK Query service: `src/services/[module]/index.ts`
8. Create Redux slice: `src/redux/slices/[module]/slice.ts` + `reducers.ts` + `selectors.ts`
9. Register slice in `src/redux/store.ts`
10. Register service tag in `src/services/base-api/index.tsx` TAGS array
11. Create `src/modules/[module]/hooks/useGet[Module]List.tsx`
12. Create `src/modules/[module]/[Module]List/index.tsx`
13. Create `src/modules/[module]/[Module]Form/index.tsx`
14. Create page: `src/app/(dashboard)/[module]/page.tsx`
15. Add nav item in `src/layout/Sidebar/index.tsx`

---

## Redux Slice Pattern

Every module slice uses **three separate files**: `slice.ts`, `reducers.ts`, `selectors.ts`.

### reducers.ts
```ts
import { PAGINATION } from '@/config';

const setPageReducer = (state: any, action: any) => {
  state.page = action.payload;
};

const setPageLimitReducer = (state: any, action: any) => {
  state.pageLimit = action.payload;
};

const setSearchReducer = (state: any, action: any) => {
  state.search = action.payload.searchTerm;
  state.page = action.payload.page;
};

const set[Module]TotalRecordsReducer = (state: any, action: any) => {
  state.totalRecords = action.payload;
};

const resetComponentStateReducer = (state: any) => {
  state.page = PAGINATION.CURRENT_PAGE;
  state.pageLimit = PAGINATION.PAGE_LIMIT;
  state.search = '';
  state.totalRecords = PAGINATION.TOTAL_RECORDS;
  state.filter[Module]s = {};
};

// ... more reducers as needed

export const [module]ReducersList = {
  setPageReducer,
  setPageLimitReducer,
  setSearchReducer,
  set[Module]TotalRecordsReducer,
  resetComponentStateReducer,
};
```

### slice.ts
```ts
import { createSlice } from '@reduxjs/toolkit';
import { PAGINATION } from '@/config';
import { [module]ReducersList } from './reducers';

const { setPageReducer, setPageLimitReducer, ... } = [module]ReducersList;

const [module]InitialState: any = {
  page: PAGINATION.CURRENT_PAGE,
  pageLimit: PAGINATION.PAGE_LIMIT,
  search: '',
  selectedItems: [],
  filter[Module]s: {},
  totalRecords: PAGINATION.TOTAL_RECORDS,
};

const [module]Slice = createSlice({
  name: '[module]',
  initialState: [module]InitialState,
  reducers: {
    setPage: setPageReducer,
    setPageLimit: setPageLimitReducer,
    setSearch: setSearchReducer,
    set[Module]TotalRecords: set[Module]TotalRecordsReducer,
    resetComponentState: resetComponentStateReducer,
  },
});

export const { setPage, setPageLimit, ... } = [module]Slice.actions;
export default [module]Slice.reducer;
```

### selectors.ts
```ts
import { RootState } from '@/redux/store';

export const [module]PageSelector = (state: RootState) => state.[module].page;
export const [module]PageLimitSelector = (state: RootState) => state.[module].pageLimit;
export const [module]SearchSelector = (state: RootState) => state.[module].search;
export const [module]TotalRecordsSelector = (state: RootState) => state.[module].totalRecords;
export const [module]FilterSelector = (state: RootState) => state.[module].filter[Module]s;
```

---

## RTK Query API Service Pattern

All services use `baseAPI.injectEndpoints()` from `@/services/base-api`.

```ts
// src/services/[module]/index.ts
import { baseAPI } from '@/services/base-api';
import { API_ENDPOINTS } from '@/constants/api';

const [module]Api = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    get[Module]sList: builder.query({
      query: (params) => ({ url: API_ENDPOINTS.[MODULE].LIST, params }),
      providesTags: ['[MODULE]S'],
    }),
    get[Module]ById: builder.query({
      query: (id: string) => API_ENDPOINTS.[MODULE].DETAIL(id),
      providesTags: ['[MODULE]_DETAIL'],
    }),
    create[Module]: builder.mutation({
      query: (data) => ({ url: API_ENDPOINTS.[MODULE].CREATE, method: 'POST', body: data }),
      invalidatesTags: ['[MODULE]S'],
    }),
    update[Module]: builder.mutation({
      query: ({ id, ...data }) => ({ url: API_ENDPOINTS.[MODULE].UPDATE(id), method: 'PUT', body: data }),
      invalidatesTags: ['[MODULE]S', '[MODULE]_DETAIL'],
    }),
    delete[Module]: builder.mutation({
      query: (id: string) => ({ url: API_ENDPOINTS.[MODULE].DELETE(id), method: 'DELETE' }),
      invalidatesTags: ['[MODULE]S'],
    }),
  }),
});

export const {
  useGet[Module]sListQuery,
  useLazyGet[Module]sListQuery,
  useGet[Module]ByIdQuery,
  useCreate[Module]Mutation,
  useUpdate[Module]Mutation,
  useDelete[Module]Mutation,
} = [module]Api;
```

**Also add the tags** to `src/services/base-api/index.tsx`:
```ts
export const TAGS = [
  'USERS', 'USER_DETAIL',
  'COURSES', 'COURSE_DETAIL',
  '[MODULE]S', '[MODULE]_DETAIL',  // ← add these
] as const;
```

---

## Data Fetching Hook Pattern

```tsx
// src/modules/[module]/hooks/useGet[Module]List.tsx
import { useEffect } from 'react';
import { useLazyGet[Module]sListQuery } from '@/services/[module]';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import {
  [module]PageSelector,
  [module]PageLimitSelector,
  [module]SearchSelector,
  [module]TotalRecordsSelector,
} from '@/redux/slices/[module]/selectors';
import { set[Module]TotalRecords } from '@/redux/slices/[module]/slice';
import { errorSnackbar, getErrorMessage } from '@/utils/api';

const useGet[Module]List = () => {
  const dispatch = useAppDispatch();
  const page = useAppSelector([module]PageSelector);
  const pageLimit = useAppSelector([module]PageLimitSelector);
  const search = useAppSelector([module]SearchSelector);

  const [lazyGet[Module]sList, { data, isLoading, isFetching }] = useLazyGet[Module]sListQuery();

  const get[Module]sList = async (currentPage = page) => {
    try {
      const response = await lazyGet[Module]sList({
        page: currentPage,
        limit: pageLimit,
        search,
      }).unwrap();
      if (response?.meta?.total !== undefined) {
        dispatch(set[Module]TotalRecords(response.meta.total));
      }
    } catch (error) {
      errorSnackbar(getErrorMessage(error));
    }
  };

  useEffect(() => {
    get[Module]sList(page);
  }, [page, pageLimit, search]);

  return {
    [module]s: data?.data || [],
    loading: isLoading || isFetching,
    get[Module]sList,
  };
};

export default useGet[Module]List;
```

---

## Common Components Usage

### CustomTable

```tsx
import CustomTable, { TableColumn } from '@/components/CustomTable';

const columns: TableColumn[] = [
  { id: 'title', label: 'Title', minWidth: 200 },
  { id: 'status', label: 'Status', minWidth: 100, render: (row) => <Chip label={row.status} /> },
  { id: 'actions', label: 'Actions', align: 'center', render: (row) => (
    <IconButton onClick={() => handleEdit(row)}><EditIcon /></IconButton>
  )},
];

<CustomTable
  columns={columns}
  rows={items}
  loading={loading}
  page={page - 1}             // MUI is 0-indexed, Redux is 1-indexed
  rowsPerPage={pageLimit}
  totalRecords={totalRecords}
  onPageChange={(p) => dispatch(setPage(p + 1))}
  onRowsPerPageChange={(limit) => dispatch(setPageLimit(limit))}
/>
```

### CustomModal

```tsx
import CustomModal from '@/components/CustomModal';

<CustomModal
  open={open}
  onClose={onClose}
  title="Create Item"
  actions={
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Button variant="outlined" onClick={onClose}>Cancel</Button>
      <Button variant="contained" onClick={handleSubmit(onSubmit)}>Save</Button>
    </Box>
  }
>
  {/* form content */}
</CustomModal>
```

### CustomButton

```tsx
import CustomButton from '@/components/CustomButton';
import AddIcon from '@mui/icons-material/Add';

<CustomButton
  label="Add Item"
  variant="contained"
  startIcon={<AddIcon />}
  loading={isLoading}
  onClick={handleClick}
/>
```

### PageHeader

```tsx
import PageHeader from '@/components/PageHeader';

<PageHeader
  title="Products"
  breadcrumbs={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Products' },
  ]}
  actions={<CustomButton label="Add Product" variant="contained" onClick={handleCreate} />}
/>
```

### ConfirmDialog

```tsx
import ConfirmDialog from '@/components/ConfirmDialog';

<ConfirmDialog
  open={deleteConfirm.open}
  title="Delete Item"
  message="Are you sure? This action cannot be undone."
  onConfirm={handleDeleteConfirm}
  onCancel={() => setDeleteConfirm({ open: false, id: null })}
  loading={deleteLoading}
/>
```

### FormFields (inside React Hook Form)

```tsx
import { CustomTextField, CustomSelect } from '@/components/FormFields';

// CustomTextField
<CustomTextField
  name="email"
  control={control}
  label="Email"
  textFieldProps={{ type: 'email' }}
/>

// CustomSelect
<CustomSelect
  name="status"
  control={control}
  label="Status"
  options={[
    { label: 'Active', value: STATUS.ACTIVE },
    { label: 'Inactive', value: STATUS.INACTIVE },
  ]}
/>
```

---

## Icons Usage

Always import from `@mui/icons-material`. Never use emoji or image as icon in UI actions.

```tsx
// ✅ CORRECT — named imports only
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';

// In JSX — wrap with Tooltip + IconButton for action buttons
<Tooltip title="Edit">
  <IconButton size="small" onClick={() => handleEdit(row)}>
    <EditIcon fontSize="small" />
  </IconButton>
</Tooltip>

// In buttons — use startIcon prop
<Button startIcon={<AddIcon />} variant="contained">Add Item</Button>
```

---

## Images Usage

Static images live in `public/images/`. Reference them with absolute paths.

```tsx
// ✅ CORRECT
import Image from 'next/image';

<Image src="/images/logo.png" alt="Logo" width={120} height={40} />

// For background images in sx prop
<Box sx={{ backgroundImage: 'url(/images/banner.jpg)', backgroundSize: 'cover' }} />
```

Never use `<img>` tags — always use Next.js `<Image>`.

---

## Component Styling Rules

1. **Styles always in `styles.ts`** — never inline in `index.tsx`.
2. **Each component folder must have a `styles.ts` file** — co-located with `index.tsx`.
3. **Named export** `export const styles` — not default export.
4. **Every style value is a function** returning an object: `key: () => ({ ... })`.
5. **Use optional chaining** when calling: `styles?.key()`.
6. **Use MUI `sx` prop** — no separate CSS files unless global styles in `globals.css`.
7. **kebab-case** for any CSS class names in `globals.css`.
8. **Responsive**: use MUI breakpoint syntax inside style objects.

```ts
// ✅ CORRECT — styles.ts
export const styles = {
  container: () => ({
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    p: 3,
    borderRadius: 2,
    backgroundColor: 'background.paper',
  }),
  title: () => ({
    fontWeight: 700,
    fontSize: { xs: '1rem', md: '1.25rem' },   // responsive
    color: 'text.primary',
  }),
  // With theme:
  highlighted: (theme: any) => ({
    backgroundColor: theme?.palette?.primary?.light,
    color: theme?.palette?.primary?.dark,
  }),
  // With theme + dynamic param:
  statusBadge: (theme: any, active: boolean) => ({
    backgroundColor: active ? theme?.palette?.success?.light : theme?.palette?.error?.light,
  }),
};

// ✅ CORRECT — index.tsx
import { useTheme } from '@mui/material';
import { styles } from './styles';

const MyComponent = ({ status }: { status: boolean }) => {
  const theme = useTheme();
  return (
    <Box sx={styles?.container()}>
      <Typography sx={styles?.title()}>Title</Typography>
      <Box sx={styles?.highlighted(theme)}>Highlighted</Box>
      <Chip sx={styles?.statusBadge(theme, status)} />
    </Box>
  );
};
```

---

## Notifications (Snackbars)

Always use the helper functions from `@/utils/api`. Never call `enqueueSnackbar` directly in components.

```ts
import { successSnackbar, errorSnackbar, warningSnackbar, getErrorMessage } from '@/utils/api';
import { SUCCESS_MESSAGES } from '@/constants/messages';

// ✅ CORRECT
successSnackbar(SUCCESS_MESSAGES.USER_CREATED);
errorSnackbar(getErrorMessage(error));

// ❌ WRONG
enqueueSnackbar('User created!', { variant: 'success' });
```

---

## Error Handling in Mutations

Always wrap RTK Query mutation calls with try/catch and call `.unwrap()`.

```ts
const onSubmit = async (data: FormData) => {
  try {
    await createItem(data).unwrap();
    successSnackbar(SUCCESS_MESSAGES.ITEM_CREATED);
    onClose();
  } catch (error) {
    errorSnackbar(getErrorMessage(error));
  }
};
```

---

## Constants Reference

### constants/index.ts — Add all route paths and enums here
```ts
export const ROUTES = {
  AUTH: { LOGIN: '/login' },
  DASHBOARD: '/dashboard',
  [MODULE]: { LIST: '/[module]', DETAIL: '/[module]/[id]' },
};

export const [MODULE]_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;
```

### constants/api.ts — Add all API endpoint paths here
```ts
export const API_ENDPOINTS = {
  [MODULE]: {
    LIST: '/[module]',
    DETAIL: (id: string) => `/[module]/${id}`,
    CREATE: '/[module]',
    UPDATE: (id: string) => `/[module]/${id}`,
    DELETE: (id: string) => `/[module]/${id}`,
  },
};
```

### constants/messages.ts — Add all notification messages here
```ts
export const SUCCESS_MESSAGES = {
  [MODULE]_CREATED: '[Module] created successfully.',
  [MODULE]_UPDATED: '[Module] updated successfully.',
  [MODULE]_DELETED: '[Module] deleted successfully.',
};

export const ERROR_MESSAGES = {
  [MODULE]_FETCH_FAILED: 'Failed to load [module]s.',
};
```

### constants/validation.ts — Add all Yup schemas here
```ts
export const [module]Schema = yup.object({
  title: yup.string().required('Title is required').max(200),
  status: yup.string().required('Status is required'),
});
```

---

## Types Pattern

```ts
// src/types/modules/[module].ts
export interface [Module] {
  _id: string;
  // ... fields
  createdAt: string;
  updatedAt: string;
}

export interface Create[Module]Dto {
  // required fields for creation
}

export interface Update[Module]Dto {
  // fields allowed in update
}
```

---

## Page File Pattern

Pages are thin wrappers — they only import and render the module list component.

```tsx
// src/app/(dashboard)/[module]/page.tsx
import [Module]List from '@/modules/[module]/[Module]List';

const [Module]Page = () => <[Module]List />;

export default [Module]Page;
```

---

## store.ts — Registering a New Slice

```ts
// src/redux/store.ts
import [module]Slice from '@/redux/slices/[module]/slice';

const store = configureStore({
  reducer: {
    [baseAPI.reducerPath]: baseAPI.reducer,
    auth: authSlice,
    users: usersSlice,
    courses: coursesSlice,
    [module]: [module]Slice,   // ← add here
  },
  ...
});
```

---

## Sidebar — Adding a Nav Item

```tsx
// src/layout/Sidebar/index.tsx
import [Module]Icon from '@mui/icons-material/[ModuleIcon]';
import { ROUTES } from '@/constants';

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, href: ROUTES.DASHBOARD },
  { label: 'Users', icon: <PeopleIcon />, href: ROUTES.USERS.LIST },
  { label: 'Courses', icon: <SchoolIcon />, href: ROUTES.COURSES.LIST },
  { label: '[Module]', icon: <[Module]Icon />, href: ROUTES.[MODULE].LIST },  // ← add here
];
```

---

## What NOT To Do

- ❌ Never use `function` keyword — always arrow functions
- ❌ Never use relative `../` imports — always `@/`
- ❌ Never hard-code strings, numbers, or routes — always use constants
- ❌ Never put logic (API calls, useEffect, useSelector) inside JSX components — extract to hooks
- ❌ Never call `enqueueSnackbar` directly — use `successSnackbar` / `errorSnackbar`
- ❌ Never use `<img>` — always `next/image`
- ❌ Never use emoji as icons in UI actions — use `@mui/icons-material`
- ❌ Never define `const styles = { ... }` inside `index.tsx` — always put it in a separate `styles.ts`
- ❌ Never use inline `sx={{ ... }}` with complex values inside JSX — always use `styles?.key()`
- ❌ Never define styles as plain objects — always use functions: `key: () => ({ ... })`
- ❌ Never skip `'use client'` on interactive components
- ❌ Never add a new module without registering its slice in `store.ts` and its tags in `base-api`
- ❌ Never create a component file without `export default` at the bottom
