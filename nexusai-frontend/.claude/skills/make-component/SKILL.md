# Skill: make-component

Use this skill whenever you need to add a new **reusable common component** to `src/components/`.

Common components are shared across multiple modules. They must be generic, accept props, and have no direct dependency on any specific module's store, service, or types.

---

## When to Create a Common Component vs Module Component

| Type | Location | Rules |
|---|---|---|
| **Common / Shared** | `src/components/[ComponentName]/` | No module-specific imports. Used by ≥2 modules. Generic props. |
| **Module-specific** | `src/modules/[module]/[ComponentName]/` | Can import module services, types, Redux slices. Used in 1 module. |

---

## File Structure

```
src/components/
└── [ComponentName]/
    ├── index.tsx       ← component — imports { styles } from './styles'
    └── styles.ts       ← styles — exports const styles = { ... }
```

**Always create BOTH files for every component.**

---

## styles.ts Template

```ts
// styles.ts — named export, each value is a function

export const styles = {
  container: () => ({
    // use MUI sx-compatible values (numbers = 8px spacing, string tokens for colors)
    p: 2,
    borderRadius: 2,
    backgroundColor: 'background.paper',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  }),
  title: () => ({
    fontWeight: 700,
    color: 'text.primary',
  }),
  // When MUI theme is needed:
  highlighted: (theme: any) => ({
    backgroundColor: theme?.palette?.primary?.light,
    color: theme?.palette?.primary?.dark,
  }),
  // When a dynamic value is needed (e.g. status, active):
  statusBadge: (theme: any, active: boolean) => ({
    backgroundColor: active ? theme?.palette?.success?.light : theme?.palette?.error?.light,
    color: active ? theme?.palette?.success?.dark : theme?.palette?.error?.dark,
  }),
};
```

---

## index.tsx Template

```tsx
'use client';

// ─── Imports ────────────────────────────────────────────────────────────────
import { Box, Typography, useTheme } from '@mui/material';  // add useTheme only if styles use theme
import { ReactNode } from 'react';
import { styles } from './styles';                          // always import from ./styles

// ─── Props Interface ─────────────────────────────────────────────────────────
interface [ComponentName]Props {
  title?: string;
  children?: ReactNode;
  // ... add all props
}

// ─── Component ───────────────────────────────────────────────────────────────
const [ComponentName] = ({ title, children }: [ComponentName]Props) => {
  const theme = useTheme();   // only needed if styles functions use theme param

  return (
    <Box sx={styles?.container()}>
      {title && <Typography sx={styles?.title()}>{title}</Typography>}
      {children}
    </Box>
  );
};

export default [ComponentName];
```

**Key rules:**
- `styles.ts` uses **named export**: `export const styles = { ... }`
- Every style value is a **function**: `key: () => ({ ... })`
- `index.tsx` uses **optional chaining**: `styles?.key()`
- Pass `theme` as first param if needed: `styles?.highlighted(theme)`
- Pass dynamic values as extra params: `styles?.statusBadge(theme, isActive)`
- `useTheme()` only needed in component if style functions use theme

---

## Existing Common Components Reference

Before building a new component, check if an existing one can be extended or composed.

### CustomTable
**File:** `src/components/CustomTable/index.tsx`
**Props:**
```ts
columns: TableColumn[]       // column definitions with optional render function
rows: any[]                  // data rows
loading?: boolean            // shows skeleton rows when true
selectable?: boolean         // shows checkboxes
selected?: string[]          // selected row ids
onSelectAll?: (checked) => void
onSelectRow?: (id) => void
getRowId?: (row) => string   // default: row._id
page?: number                // 0-indexed (MUI standard)
rowsPerPage?: number
totalRecords?: number
onPageChange?: (page) => void
onRowsPerPageChange?: (limit) => void
emptyMessage?: string
```
**Usage:**
```tsx
import CustomTable, { TableColumn } from '@/components/CustomTable';

const columns: TableColumn[] = [
  { id: 'name', label: 'Name', minWidth: 150 },
  { id: 'status', label: 'Status', render: (row) => <Chip label={row.status} /> },
  { id: 'actions', label: '', align: 'center', render: (row) => <IconButton>...</IconButton> },
];

<CustomTable
  columns={columns}
  rows={data}
  loading={isLoading}
  page={page - 1}
  rowsPerPage={pageLimit}
  totalRecords={total}
  onPageChange={(p) => dispatch(setPage(p + 1))}
  onRowsPerPageChange={(l) => dispatch(setPageLimit(l))}
/>
```

---

### CustomModal
**File:** `src/components/CustomModal/index.tsx`
**Props:**
```ts
open: boolean
onClose: () => void
title: string
children: ReactNode       // modal body content
actions?: ReactNode       // buttons in footer
maxWidth?: 'xs' | 'sm' | 'md' | 'lg'
```
**Usage:**
```tsx
import CustomModal from '@/components/CustomModal';

<CustomModal
  open={open}
  onClose={onClose}
  title="Edit Item"
  actions={
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Button variant="outlined" onClick={onClose}>Cancel</Button>
      <Button variant="contained" onClick={handleSubmit}>Save</Button>
    </Box>
  }
>
  <Box>form content here</Box>
</CustomModal>
```

---

### CustomButton
**File:** `src/components/CustomButton/index.tsx`
**Props:**
```ts
label: string
variant?: 'contained' | 'outlined' | 'text'
color?: 'primary' | 'secondary' | 'error' | 'warning' | 'success'
loading?: boolean         // shows spinner, disables button
startIcon?: ReactNode
endIcon?: ReactNode
onClick?: () => void
disabled?: boolean
fullWidth?: boolean
size?: 'small' | 'medium' | 'large'
```
**Usage:**
```tsx
import CustomButton from '@/components/CustomButton';
import AddIcon from '@mui/icons-material/Add';

<CustomButton
  label="Add Product"
  variant="contained"
  startIcon={<AddIcon />}
  loading={isSubmitting}
  onClick={handleCreate}
/>
```

---

### PageHeader
**File:** `src/components/PageHeader/index.tsx`
**Props:**
```ts
title: string
breadcrumbs?: Array<{ label: string; href?: string }>
actions?: ReactNode
```
**Usage:**
```tsx
import PageHeader from '@/components/PageHeader';

<PageHeader
  title="Orders"
  breadcrumbs={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Orders' },
  ]}
  actions={<CustomButton label="New Order" variant="contained" onClick={handleCreate} />}
/>
```

---

### ConfirmDialog
**File:** `src/components/ConfirmDialog/index.tsx`
**Props:**
```ts
open: boolean
title: string
message: string
onConfirm: () => void
onCancel: () => void
loading?: boolean
confirmLabel?: string
cancelLabel?: string
confirmColor?: 'error' | 'primary' | 'warning'
```
**Usage:**
```tsx
import ConfirmDialog from '@/components/ConfirmDialog';

const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null as string | null });

<ConfirmDialog
  open={deleteConfirm.open}
  title="Delete Order"
  message="Are you sure you want to delete this order? This cannot be undone."
  onConfirm={handleDeleteConfirm}
  onCancel={() => setDeleteConfirm({ open: false, id: null })}
  loading={deleting}
  confirmColor="error"
/>
```

---

### FormFields — CustomTextField
**File:** `src/components/FormFields/CustomTextField/index.tsx`
**Props:**
```ts
name: string              // field name in react-hook-form
control: Control<any>     // from useForm()
label: string
textFieldProps?: TextFieldProps   // any MUI TextField prop (type, disabled, etc.)
```
**Usage:**
```tsx
import { CustomTextField } from '@/components/FormFields';

<CustomTextField name="firstName" control={control} label="First Name" />
<CustomTextField name="email" control={control} label="Email" textFieldProps={{ type: 'email' }} />
<CustomTextField name="password" control={control} label="Password" textFieldProps={{ type: 'password' }} />
```

---

### FormFields — CustomSelect
**File:** `src/components/FormFields/CustomSelect/index.tsx`
**Props:**
```ts
name: string
control: Control<any>
label: string
options: Array<{ label: string; value: string | number }>
```
**Usage:**
```tsx
import { CustomSelect } from '@/components/FormFields';
import { USER_ROLES } from '@/constants';

<CustomSelect
  name="role"
  control={control}
  label="Role"
  options={[
    { label: 'Admin', value: USER_ROLES.ADMIN },
    { label: 'User', value: USER_ROLES.USER },
  ]}
/>
```

---

## Adding a New Form Field Component

When you need a new field type (e.g. date picker, file upload, checkbox group), create it in:
`src/components/FormFields/[FieldName]/index.tsx`

Then export it from `src/components/FormFields/index.tsx`:
```ts
export { default as CustomTextField } from './CustomTextField';
export { default as CustomSelect } from './CustomSelect';
export { default as CustomDatePicker } from './CustomDatePicker';  // ← add here
```

Template for a new form field:
```tsx
'use client';
import { Controller, Control } from 'react-hook-form';
// import the MUI input component
import { DatePicker } from '@mui/x-date-pickers';

interface Custom[FieldName]Props {
  name: string;
  control: Control<any>;
  label: string;
  // any additional props
}

const Custom[FieldName] = ({ name, control, label }: Custom[FieldName]Props) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      // render the MUI input with field spread + error handling
      <DatePicker
        {...field}
        label={label}
        slotProps={{
          textField: {
            fullWidth: true,
            size: 'small',
            error: !!fieldState.error,
            helperText: fieldState.error?.message,
            sx: { mb: 2 },
          },
        }}
      />
    )}
  />
);

export default Custom[FieldName];
```

---

## Icons in Components

Always import icons from `@mui/icons-material`. Use named imports, one per line.

```tsx
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
```

Wrap action icons with Tooltip and IconButton:
```tsx
<Tooltip title="View Details">
  <IconButton size="small" onClick={() => handleView(row._id)}>
    <VisibilityIcon fontSize="small" />
  </IconButton>
</Tooltip>
```

---

## Styling Rules for Components

1. **Styles always in `styles.ts`** — never `const styles = ...` inside `index.tsx`
2. **Named export** — `export const styles = { ... }` (not default)
3. **Every value is a function** — `key: () => ({ ... })`
4. **Optional chaining in component** — `styles?.key()` never `styles.key`
5. **No raw CSS classes** — always use MUI `sx` prop
6. **Use MUI color tokens** — never hard-code hex values:
   ```ts
   // ✅ CORRECT — token strings
   color: 'text.primary'
   backgroundColor: 'background.paper'
   borderColor: 'divider'
   color: 'primary.main'
   color: 'error.main'
   color: 'success.main'

   // When hex is truly needed (e.g. white overlay), use theme:
   backgroundColor: theme?.palette?.common?.white

   // ❌ WRONG — hard-coded hex
   color: '#333333'
   backgroundColor: '#ffffff'
   ```
7. **Use MUI spacing** — numbers map to 8px units:
   ```ts
   p: 2       // = padding: 16px
   gap: 1     // = gap: 8px
   mb: 3      // = margin-bottom: 24px
   ```
8. **Responsive values** use object syntax:
   ```ts
   fontSize: { xs: '0.875rem', md: '1rem' }
   display: { xs: 'none', sm: 'flex' }
   ```

---

## Component Checklist

Before finalising any new component:
- [ ] `styles.ts` created in the same folder as `index.tsx`
- [ ] `styles.ts` uses named export: `export const styles = { ... }`
- [ ] Every style value in `styles.ts` is a function: `key: () => ({ ... })`
- [ ] `index.tsx` imports with: `import { styles } from './styles'`
- [ ] `index.tsx` calls styles with optional chaining: `styles?.key()`
- [ ] `useTheme()` added to component only if any style function uses theme
- [ ] `'use client'` directive on first line (if interactive)
- [ ] Props typed with an interface
- [ ] `export default ComponentName` at the bottom
- [ ] No module-specific imports (services, slices, selectors)
- [ ] No hard-coded strings — use props or constants
- [ ] No inline `sx={{ complexValue }}` inside JSX — always in `styles.ts`
- [ ] If it's a FormField, exported from `src/components/FormFields/index.tsx`
