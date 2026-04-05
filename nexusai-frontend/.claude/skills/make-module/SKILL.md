# Skill: make-module

Use this skill to add a complete new feature module to the project (e.g. Products, Orders, Categories, Enrollments).

A module includes: types, constants, RTK Query service, Redux slice (3 files), data-fetching hook, list component, form component, and page file.

---

## Checklist — Complete Every Step in Order

When adding a module named `[Module]` (e.g. Product, Order), replace:
- `[Module]` → PascalCase singular (e.g. `Product`)
- `[module]` → camelCase singular (e.g. `product`)
- `[modules]` → camelCase plural (e.g. `products`)
- `[MODULE]` → UPPER_SNAKE_CASE (e.g. `PRODUCT`)

---

### Step 1 — Types
**File:** `src/types/modules/[module].ts`

```ts
export interface [Module] {
  _id: string;
  // add all fields the API returns
  createdAt: string;
  updatedAt: string;
}

export interface Create[Module]Dto {
  // fields required when creating
}

export interface Update[Module]Dto {
  // fields allowed when editing
}
```

---

### Step 2 — API Endpoints Constant
**File:** `src/constants/api.ts` — append to existing `API_ENDPOINTS` object:

```ts
[MODULE]: {
  LIST: '/[modules]',
  DETAIL: (id: string) => `/[modules]/${id}`,
  CREATE: '/[modules]',
  UPDATE: (id: string) => `/[modules]/${id}`,
  DELETE: (id: string) => `/[modules]/${id}`,
},
```

---

### Step 3 — Route Constants
**File:** `src/constants/index.ts` — append to `ROUTES` and add any status/level enums:

```ts
// Inside ROUTES:
[MODULE]: {
  LIST: '/[modules]',
},

// Status enum (if needed):
export const [MODULE]_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;
```

---

### Step 4 — Success/Error Messages
**File:** `src/constants/messages.ts` — append:

```ts
// Inside SUCCESS_MESSAGES:
[MODULE]_CREATED: '[Module] created successfully.',
[MODULE]_UPDATED: '[Module] updated successfully.',
[MODULE]_DELETED: '[Module] deleted successfully.',

// Inside ERROR_MESSAGES (if needed):
[MODULE]_FETCH_FAILED: 'Failed to load [modules].',
```

---

### Step 5 — Validation Schema
**File:** `src/constants/validation.ts` — append:

```ts
export const [module]Schema = yup.object({
  // define all form fields with validation rules
  title: yup.string().required('Title is required').max(200),
  status: yup.string().required('Status is required'),
  // ... add more fields
});

// If create and update have different rules, make two schemas:
export const create[Module]Schema = yup.object({ ... });
export const update[Module]Schema = yup.object({ ... });
```

---

### Step 6 — RTK Query Service
**File:** `src/services/[module]/index.ts` (create new file)

```ts
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
      query: (data) => ({
        url: API_ENDPOINTS.[MODULE].CREATE,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['[MODULE]S'],
    }),
    update[Module]: builder.mutation({
      query: ({ id, ...data }) => ({
        url: API_ENDPOINTS.[MODULE].UPDATE(id),
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['[MODULE]S', '[MODULE]_DETAIL'],
    }),
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

### Step 7 — Register Tags in base-api
**File:** `src/services/base-api/index.tsx` — add to the `TAGS` array:

```ts
export const TAGS = [
  'USERS', 'USER_DETAIL',
  'COURSES', 'COURSE_DETAIL',
  '[MODULE]S', '[MODULE]_DETAIL',   // ← add these two
] as const;
```

---

### Step 8 — Redux Reducers
**File:** `src/redux/slices/[module]/reducers.ts` (create new file)

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
  state.selected[Module]s = [];
  state.totalRecords = PAGINATION.TOTAL_RECORDS;
  state.filter[Module]s = {};
};

const setSelected[Module]sReducer = (state: any, action: any) => {
  state.selected[Module]s = action.payload;
};

const emptySelected[Module]sReducer = (state: any) => {
  state.selected[Module]s = [];
};

const setFilter[Module]sReducer = (state: any, action: any) => {
  state.filter[Module]s = action.payload.filterValues;
  state.page = action.payload.page;
};

const emptyFilter[Module]sReducer = (state: any) => {
  state.filter[Module]s = {};
};

export const [module]ReducersList = {
  setPageReducer,
  setPageLimitReducer,
  setSearchReducer,
  set[Module]TotalRecordsReducer,
  resetComponentStateReducer,
  setSelected[Module]sReducer,
  emptySelected[Module]sReducer,
  setFilter[Module]sReducer,
  emptyFilter[Module]sReducer,
};
```

---

### Step 9 — Redux Slice
**File:** `src/redux/slices/[module]/slice.ts` (create new file)

```ts
import { createSlice } from '@reduxjs/toolkit';
import { PAGINATION } from '@/config';
import { [module]ReducersList } from './reducers';

const {
  setPageReducer,
  setPageLimitReducer,
  setSearchReducer,
  set[Module]TotalRecordsReducer,
  resetComponentStateReducer,
  setSelected[Module]sReducer,
  emptySelected[Module]sReducer,
  setFilter[Module]sReducer,
  emptyFilter[Module]sReducer,
} = [module]ReducersList;

const [module]InitialState: any = {
  page: PAGINATION.CURRENT_PAGE,
  pageLimit: PAGINATION.PAGE_LIMIT,
  search: '',
  selected[Module]s: [],
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
    setSelected[Module]s: setSelected[Module]sReducer,
    emptySelected[Module]s: emptySelected[Module]sReducer,
    setFilter[Module]s: setFilter[Module]sReducer,
    emptyFilter[Module]s: emptyFilter[Module]sReducer,
  },
});

export const {
  setPage,
  setPageLimit,
  setSearch,
  set[Module]TotalRecords,
  resetComponentState,
  setSelected[Module]s,
  emptySelected[Module]s,
  setFilter[Module]s,
  emptyFilter[Module]s,
} = [module]Slice.actions;

export default [module]Slice.reducer;
```

---

### Step 10 — Redux Selectors
**File:** `src/redux/slices/[module]/selectors.ts` (create new file)

```ts
import { RootState } from '@/redux/store';

export const [module]PageSelector = (state: RootState) => state.[module].page;
export const [module]PageLimitSelector = (state: RootState) => state.[module].pageLimit;
export const [module]SearchSelector = (state: RootState) => state.[module].search;
export const [module]TotalRecordsSelector = (state: RootState) => state.[module].totalRecords;
export const [module]SelectedSelector = (state: RootState) => state.[module].selected[Module]s;
export const [module]FilterSelector = (state: RootState) => state.[module].filter[Module]s;
```

---

### Step 11 — Register Slice in Store
**File:** `src/redux/store.ts` — add the new slice:

```ts
import [module]Slice from '@/redux/slices/[module]/slice';

// Inside configureStore reducer:
[module]: [module]Slice,
```

Also add `[module]: ReturnType<typeof [module]Slice>` is inferred automatically from the store.

---

### Step 12 — Data Fetching Hook
**File:** `src/modules/[module]/hooks/useGet[Module]List.tsx` (create new file)

```tsx
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
  const totalRecords = useAppSelector([module]TotalRecordsSelector);

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
    [modules]: data?.data || [],
    loading: isLoading || isFetching,
    totalRecords,
    page,
    pageLimit,
    search,
    get[Module]sList,
  };
};

export default useGet[Module]List;
```

---

### Step 13 — List Component Styles File
**File:** `src/modules/[module]/[Module]List/styles.ts` (create new file)

```ts
export const styles = {
  wrapper: () => ({}),
  actionCell: () => ({
    display: 'flex',
    gap: 0.5,
  }),
  // Add status/level chip styles that need theme + dynamic value:
  statusChip: (theme: any, status: string) => ({
    backgroundColor: status === 'active' ? theme?.palette?.success?.light : theme?.palette?.warning?.light,
    color: status === 'active' ? theme?.palette?.success?.dark : theme?.palette?.warning?.dark,
    fontSize: '0.75rem',
    fontWeight: 600,
    height: 24,
  }),
};
```

### Step 13b — List Component
**File:** `src/modules/[module]/[Module]List/index.tsx` (create new file)

```tsx
'use client';
import { Box, Chip, useTheme } from '@mui/material';
import { useState } from 'react';
import CustomTable, { TableColumn } from '@/components/CustomTable';
import CustomButton from '@/components/CustomButton';
import ConfirmDialog from '@/components/ConfirmDialog';
import PageHeader from '@/components/PageHeader';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Tooltip } from '@mui/material';
import { useDelete[Module]Mutation } from '@/services/[module]';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { setPage, setPageLimit } from '@/redux/slices/[module]/slice';
import { [module]PageSelector, [module]PageLimitSelector, [module]TotalRecordsSelector } from '@/redux/slices/[module]/selectors';
import useGet[Module]List from '../hooks/useGet[Module]List';
import [Module]Form from '../[Module]Form';
import { successSnackbar, errorSnackbar, getErrorMessage } from '@/utils/api';
import { SUCCESS_MESSAGES } from '@/constants/messages';
import { ROUTES } from '@/constants';
import { [Module] } from '@/types/modules/[module]';
import { styles } from './styles';

const [Module]List = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const page = useAppSelector([module]PageSelector);
  const pageLimit = useAppSelector([module]PageLimitSelector);
  const totalRecords = useAppSelector([module]TotalRecordsSelector);

  const { [modules], loading } = useGet[Module]List();
  const [delete[Module], { isLoading: deleteLoading }] = useDelete[Module]Mutation();

  const [formOpen, setFormOpen] = useState(false);
  const [edit[Module], setEdit[Module]] = useState<[Module] | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });

  const handleOpenCreate = () => { setEdit[Module](null); setFormOpen(true); };
  const handleOpenEdit = (item: [Module]) => { setEdit[Module](item); setFormOpen(true); };
  const handleCloseForm = () => { setFormOpen(false); setEdit[Module](null); };
  const handleDeleteClick = (id: string) => setDeleteConfirm({ open: true, id });
  const handleDeleteCancel = () => setDeleteConfirm({ open: false, id: null });

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.id) return;
    try {
      await delete[Module](deleteConfirm.id).unwrap();
      successSnackbar(SUCCESS_MESSAGES.[MODULE]_DELETED);
    } catch (error) {
      errorSnackbar(getErrorMessage(error));
    } finally {
      setDeleteConfirm({ open: false, id: null });
    }
  };

  const columns: TableColumn[] = [
    { id: 'title', label: 'Title', minWidth: 200 },
    // add more columns here...
    {
      id: 'status', label: 'Status', minWidth: 100,
      render: (row) => <Chip label={row.status} size="small" sx={styles?.statusChip(theme, row.status)} />,
    },
    {
      id: 'actions', label: 'Actions', minWidth: 100, align: 'center',
      render: (row) => (
        <Box sx={styles?.actionCell()}>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleOpenEdit(row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => handleDeleteClick(row._id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={styles?.wrapper()}>
      <PageHeader
        title="[Module]s"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: '[Module]s' },
        ]}
        actions={
          <CustomButton
            label="Add [Module]"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
          />
        }
      />
      <CustomTable
        columns={columns}
        rows={[modules]}
        loading={loading}
        page={page - 1}
        rowsPerPage={pageLimit}
        totalRecords={totalRecords}
        onPageChange={(p) => dispatch(setPage(p + 1))}
        onRowsPerPageChange={(limit) => dispatch(setPageLimit(limit))}
      />
      <[Module]Form open={formOpen} onClose={handleCloseForm} edit[Module]={edit[Module]} />
      <ConfirmDialog
        open={deleteConfirm.open}
        title="Delete [Module]"
        message="Are you sure you want to delete this [module]? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={deleteLoading}
      />
    </Box>
  );
};

export default [Module]List;
```

---

### Step 14 — Form Component Styles File
**File:** `src/modules/[module]/[Module]Form/styles.ts` (create new file)

```ts
export const styles = {
  form: () => ({
    display: 'flex',
    flexDirection: 'column',
  }),
  buttonRow: () => ({
    display: 'flex',
    gap: 1,
  }),
};
```

### Step 14b — Form Component
**File:** `src/modules/[module]/[Module]Form/index.tsx` (create new file)

```tsx
'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button } from '@mui/material';
import CustomModal from '@/components/CustomModal';
import { CustomTextField, CustomSelect } from '@/components/FormFields';
import { create[Module]Schema, update[Module]Schema } from '@/constants/validation';
import { useCreate[Module]Mutation, useUpdate[Module]Mutation } from '@/services/[module]';
import { successSnackbar, errorSnackbar, getErrorMessage } from '@/utils/api';
import { SUCCESS_MESSAGES } from '@/constants/messages';
import { [Module], Create[Module]Dto } from '@/types/modules/[module]';
import { styles } from './styles';

interface [Module]FormProps {
  open: boolean;
  onClose: () => void;
  edit[Module]?: [Module] | null;
}

const [Module]Form = ({ open, onClose, edit[Module] }: [Module]FormProps) => {
  const isEdit = !!edit[Module];
  const [create[Module], { isLoading: creating }] = useCreate[Module]Mutation();
  const [update[Module], { isLoading: updating }] = useUpdate[Module]Mutation();

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(isEdit ? update[Module]Schema : create[Module]Schema) as any,
    defaultValues: {
      // set default values for all fields
      title: '',
      status: '',
    },
  });

  useEffect(() => {
    if (edit[Module]) {
      reset({
        // map edit[Module] fields to form defaults
        title: edit[Module].title,
        status: edit[Module].status,
      });
    } else {
      reset({ title: '', status: '' });
    }
  }, [edit[Module], reset]);

  const onSubmit = async (data: any) => {
    try {
      if (isEdit && edit[Module]) {
        await update[Module]({ id: edit[Module]._id, ...data }).unwrap();
        successSnackbar(SUCCESS_MESSAGES.[MODULE]_UPDATED);
      } else {
        await create[Module](data as Create[Module]Dto).unwrap();
        successSnackbar(SUCCESS_MESSAGES.[MODULE]_CREATED);
      }
      onClose();
    } catch (error) {
      errorSnackbar(getErrorMessage(error));
    }
  };

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit [Module]' : 'Create [Module]'}
      actions={
        <Box sx={styles?.buttonRow()}>
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            disabled={creating || updating}
          >
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </Box>
      }
    >
      <Box component="form" sx={styles?.form()} onSubmit={handleSubmit(onSubmit)}>
        <CustomTextField name="title" control={control} label="Title" />
        {/* add more fields here */}
      </Box>
    </CustomModal>
  );
};

export default [Module]Form;
```

---

### Step 15 — Page File
**File:** `src/app/(dashboard)/[modules]/page.tsx` (create new file)

```tsx
import [Module]List from '@/modules/[module]/[Module]List';

const [Module]Page = () => <[Module]List />;

export default [Module]Page;
```

---

### Step 16 — Add Sidebar Nav Item
**File:** `src/layout/Sidebar/index.tsx` — add to navItems array:

```tsx
import [Icon]Icon from '@mui/icons-material/[Icon]';

// Inside navItems array:
{ label: '[Module]s', icon: <[Icon]Icon />, href: ROUTES.[MODULE].LIST },
```

---

## Verification Checklist

After creating all files, verify:
- [ ] `src/types/modules/[module].ts` exists
- [ ] `API_ENDPOINTS.[MODULE]` added to `constants/api.ts`
- [ ] `ROUTES.[MODULE]` added to `constants/index.ts`
- [ ] Success messages added to `constants/messages.ts`
- [ ] Yup schema added to `constants/validation.ts`
- [ ] `src/services/[module]/index.ts` created and exports all hooks
- [ ] Tags `'[MODULE]S'` and `'[MODULE]_DETAIL'` added to `base-api/index.tsx` TAGS
- [ ] `src/redux/slices/[module]/reducers.ts` created
- [ ] `src/redux/slices/[module]/slice.ts` created
- [ ] `src/redux/slices/[module]/selectors.ts` created
- [ ] Slice registered in `src/redux/store.ts`
- [ ] `src/modules/[module]/hooks/useGet[Module]List.tsx` created
- [ ] `src/modules/[module]/[Module]List/styles.ts` created
- [ ] `src/modules/[module]/[Module]List/index.tsx` created (imports from `./styles`)
- [ ] `src/modules/[module]/[Module]Form/styles.ts` created
- [ ] `src/modules/[module]/[Module]Form/index.tsx` created (imports from `./styles`)
- [ ] `src/app/(dashboard)/[modules]/page.tsx` created
- [ ] Nav item added to `src/layout/Sidebar/index.tsx`
