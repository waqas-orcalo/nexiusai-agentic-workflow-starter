# Skill: make-api-service

Use this skill whenever you need to add or modify RTK Query API calls — adding new endpoints to an existing service, or registering a brand new service from scratch.

---

## Key Architecture Rules

- All API calls go through RTK Query. **Never use axios or fetch directly inside components.**
- All services extend `baseAPI` from `@/services/base-api` via `injectEndpoints()`.
- All API URL paths live in `src/constants/api.ts` — never hard-code a URL string in a service file.
- Cache invalidation tags must be registered in `src/services/base-api/index.tsx` TAGS array before use.
- Use `.unwrap()` in all mutation calls so errors propagate to try/catch.

---

## base-api Structure

```tsx
// src/services/base-api/index.tsx
export const TAGS = [
  'USERS', 'USER_DETAIL',
  'COURSES', 'COURSE_DETAIL',
  // add new tags here
] as const;

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState, endpoint }) => {
    const token = (getState() as RootState)?.auth?.accessToken;
    if (token && !BYPASS_AUTH_API_ROUTES.includes(endpoint as any)) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseAPI = createApi({ reducerPath: 'api', baseQuery, tagTypes: TAGS, endpoints: () => ({}) });
export const clearApiCache = baseAPI.util.resetApiState;
```

The `prepareHeaders` automatically injects the Bearer token from Redux for all non-auth routes. You do not need to handle auth headers in individual services.

---

## Adding a New Service File

**File:** `src/services/[module]/index.ts`

```ts
import { baseAPI } from '@/services/base-api';
import { API_ENDPOINTS } from '@/constants/api';

const [module]Api = baseAPI.injectEndpoints({
  endpoints: (builder) => ({

    // LIST — paginated GET
    get[Module]sList: builder.query({
      query: (params) => ({
        url: API_ENDPOINTS.[MODULE].LIST,
        params,            // passes ?page=1&limit=10&search=...
      }),
      providesTags: ['[MODULE]S'],
    }),

    // DETAIL — single item GET
    get[Module]ById: builder.query({
      query: (id: string) => API_ENDPOINTS.[MODULE].DETAIL(id),
      providesTags: ['[MODULE]_DETAIL'],
    }),

    // CREATE — POST mutation
    create[Module]: builder.mutation({
      query: (data) => ({
        url: API_ENDPOINTS.[MODULE].CREATE,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['[MODULE]S'],
    }),

    // UPDATE — PUT mutation
    update[Module]: builder.mutation({
      query: ({ id, ...data }) => ({
        url: API_ENDPOINTS.[MODULE].UPDATE(id),
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['[MODULE]S', '[MODULE]_DETAIL'],
    }),

    // DELETE — DELETE mutation
    delete[Module]: builder.mutation({
      query: (id: string) => ({
        url: API_ENDPOINTS.[MODULE].DELETE(id),
        method: 'DELETE',
      }),
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

---

## Adding New Tags

**File:** `src/services/base-api/index.tsx`

When adding a new module, add its cache tags to the TAGS array:

```ts
export const TAGS = [
  'USERS', 'USER_DETAIL',
  'COURSES', 'COURSE_DETAIL',
  '[MODULE]S', '[MODULE]_DETAIL',    // ← add both tags
] as const;
```

If the tag is not in this array, TypeScript will error when you use it in `providesTags` or `invalidatesTags`.

---

## Adding API Endpoint Constants

**File:** `src/constants/api.ts`

```ts
export const API_ENDPOINTS = {
  AUTH: { ... },
  USERS: { ... },
  COURSES: { ... },

  [MODULE]: {
    LIST: '/[modules]',
    DETAIL: (id: string) => `/[modules]/${id}`,
    CREATE: '/[modules]',
    UPDATE: (id: string) => `/[modules]/${id}`,
    DELETE: (id: string) => `/[modules]/${id}`,
    // Add any non-CRUD endpoints:
    PUBLISH: (id: string) => `/[modules]/${id}/publish`,
    BULK_DELETE: '/[modules]/bulk-delete',
  },
};
```

---

## Using Query Hooks (Read Data)

### useQuery — fires on mount
```tsx
import { useGet[Module]ByIdQuery } from '@/services/[module]';

const { data, isLoading, isError } = useGet[Module]ByIdQuery(id, {
  skip: !id,    // optionally skip
});
```

### useLazyQuery — fire manually (preferred for paginated lists)
```tsx
import { useLazyGet[Module]sListQuery } from '@/services/[module]';

const [lazyGet[Module]sList, { data, isLoading, isFetching }] = useLazyGet[Module]sListQuery();

const fetchData = async () => {
  const response = await lazyGet[Module]sList({ page: 1, limit: 10 }).unwrap();
};
```

---

## Using Mutation Hooks (Write Data)

```tsx
import { useCreate[Module]Mutation, useUpdate[Module]Mutation, useDelete[Module]Mutation } from '@/services/[module]';

const [create[Module], { isLoading: creating }] = useCreate[Module]Mutation();
const [update[Module], { isLoading: updating }] = useUpdate[Module]Mutation();
const [delete[Module], { isLoading: deleting }] = useDelete[Module]Mutation();

// Always use .unwrap() + try/catch
const handleCreate = async (data: Create[Module]Dto) => {
  try {
    await create[Module](data).unwrap();
    successSnackbar(SUCCESS_MESSAGES.[MODULE]_CREATED);
  } catch (error) {
    errorSnackbar(getErrorMessage(error));
  }
};

const handleUpdate = async (id: string, data: Update[Module]Dto) => {
  try {
    await update[Module]({ id, ...data }).unwrap();
    successSnackbar(SUCCESS_MESSAGES.[MODULE]_UPDATED);
  } catch (error) {
    errorSnackbar(getErrorMessage(error));
  }
};

const handleDelete = async (id: string) => {
  try {
    await delete[Module](id).unwrap();
    successSnackbar(SUCCESS_MESSAGES.[MODULE]_DELETED);
  } catch (error) {
    errorSnackbar(getErrorMessage(error));
  }
};
```

---

## Non-Standard Endpoints (e.g. bulk actions, status change)

For endpoints that don't fit CRUD, add them as named mutations or queries:

```ts
// In the service file, inside endpoints builder:

// PATCH status
toggle[Module]Status: builder.mutation({
  query: ({ id, status }) => ({
    url: API_ENDPOINTS.[MODULE].UPDATE_STATUS(id),
    method: 'PATCH',
    body: { status },
  }),
  invalidatesTags: ['[MODULE]S', '[MODULE]_DETAIL'],
}),

// POST bulk delete
bulk[Delete][Module]: builder.mutation({
  query: (ids: string[]) => ({
    url: API_ENDPOINTS.[MODULE].BULK_DELETE,
    method: 'POST',
    body: { ids },
  }),
  invalidatesTags: ['[MODULE]S'],
}),
```

---

## Clearing Cache on Logout

The `clearApiCache` function resets all RTK Query cache. It is already wired in `AuthContext.tsx` logout handler. Do not call it elsewhere unless you have a specific reason.

```ts
// Already handled in AuthContext:
dispatchClearCache(clearApiCache());
```

---

## Common Mistakes to Avoid

- ❌ Never hard-code URL strings: `query: () => '/users'` — use `API_ENDPOINTS.USERS.LIST`
- ❌ Never use `axios` or `fetch` for API calls — use RTK Query hooks
- ❌ Never access token manually to set auth headers — `prepareHeaders` in base-api handles this
- ❌ Never forget to add tags to the TAGS array in base-api before using them
- ❌ Never call mutations without `.unwrap()` — errors won't propagate to catch
- ❌ Never call mutation hooks at the top of a module that doesn't need them — destructure only what you use
