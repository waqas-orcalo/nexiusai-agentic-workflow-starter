# AAC Frontend Starter

A complete Next.js 14 frontend starter project with modern best practices, fully replicating the architecture and patterns of the Air Apple Cart (AAC) reference project.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18 + TypeScript 5
- **Component Library**: Material-UI (MUI) v5
- **State Management**: Redux Toolkit 2.x with RTK Query
- **Form Handling**: React Hook Form 7 + Yup validation
- **Notifications**: notistack
- **Authentication**: JWT-based with session storage
- **HTTP Client**: Axios (via RTK Query)

## Project Structure

```
aac-frontend-starter/
├── src/
│   ├── app/                          # Next.js 14 App Router
│   │   ├── (auth)/                   # Auth group layout
│   │   │   ├── layout.tsx
│   │   │   └── login/page.tsx
│   │   ├── (dashboard)/              # Dashboard group layout with protection
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── users/page.tsx
│   │   │   └── courses/page.tsx
│   │   ├── layout.tsx                # Root layout with providers
│   │   └── page.tsx
│   ├── assets/icons/                 # Icon exports
│   ├── components/                   # Reusable shared components (PascalCase folders)
│   │   ├── CustomButton/
│   │   ├── CustomTable/
│   │   ├── CustomModal/
│   │   ├── PageHeader/
│   │   ├── ConfirmDialog/
│   │   ├── LoadingSpinner/
│   │   ├── EmptyState/
│   │   └── FormFields/
│   ├── constants/                    # String constants, routes, validation schemas
│   │   ├── index.ts
│   │   ├── api.ts
│   │   ├── messages.ts
│   │   ├── snackbar.ts
│   │   ├── strings.ts
│   │   └── validation.ts
│   ├── contexts/                     # React contexts
│   │   └── AuthContext.tsx           # Reducer-based auth state
│   ├── GuardsAndPermissions/         # Route protection
│   │   └── AuthGuard.tsx
│   ├── hooks/                        # Custom React hooks
│   │   ├── useAuth.tsx
│   │   ├── useToggle.tsx
│   │   └── useResponsive.tsx
│   ├── layout/                       # Layout components
│   │   ├── MainLayout/
│   │   ├── Sidebar/
│   │   └── Header/
│   ├── modules/                      # Feature modules
│   │   ├── users/
│   │   │   ├── UsersList/
│   │   │   ├── UserForm/
│   │   │   └── hooks/
│   │   └── courses/
│   │       ├── CoursesList/
│   │       ├── CourseForm/
│   │       └── hooks/
│   ├── redux/                        # Redux store
│   │   ├── store.ts
│   │   └── slices/
│   │       ├── auth/
│   │       ├── users/
│   │       └── courses/
│   ├── services/                     # RTK Query APIs
│   │   ├── base-api/
│   │   ├── auth/
│   │   ├── users/
│   │   └── courses/
│   ├── styles/                       # Global styles
│   │   └── globals.css
│   ├── theme/                        # MUI theme setup
│   │   └── index.tsx
│   ├── types/                        # TypeScript interfaces
│   │   ├── shared/
│   │   └── modules/
│   ├── utils/                        # Utility functions
│   │   ├── index.ts
│   │   └── api.ts
│   ├── providers/                    # Context providers
│   │   └── ReduxProvider.tsx
│   └── config.ts                     # App configuration
├── package.json
├── next.config.js
├── tsconfig.json
├── .prettierrc
├── .eslintrc.json
└── README.md
```

## Key Features

### Best Practices Implemented

1. **Component Architecture**
   - PascalCase folder names (e.g., `CustomButton`)
   - `index.tsx` as component file
   - Styles object at top of component
   - Arrow functions only
   - Modular, reusable components

2. **Code Organization**
   - Absolute imports via `@/` alias (never relative imports)
   - Colocated helpers in separate `.ts` files
   - Centralized constants and validation schemas
   - Clear separation of concerns

3. **State Management**
   - Redux Toolkit with RTK Query
   - Reducer-based AuthContext for complex auth logic
   - Session storage for auth tokens
   - Automatic cache invalidation

4. **Form Handling**
   - React Hook Form with Yup validation
   - Reusable form field components
   - Comprehensive validation schemas

5. **Routing & Protection**
   - Next.js 14 App Router with route groups
   - AuthGuard for protected routes
   - Redirect to login on unauthorized access

6. **API Integration**
   - RTK Query for data fetching
   - Centralized base API with automatic token injection
   - Typed API endpoints
   - Cache management

## Setup & Installation

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Update NEXT_PUBLIC_API_BASE_URL in .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000

# Run development server
npm run dev

# Open http://localhost:3000
```

### Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Fix linting issues
npm run lint-fix
```

## Naming Conventions

### Folders & Files

- **Component Folders**: PascalCase (e.g., `CustomButton`, `UsersList`)
- **Component Files**: Always `index.tsx`
- **Page Components**: Suffix with `Page` (e.g., `UsersPage`, `DashboardPage`)
- **Page Routes**: kebab-case (e.g., `/users`, `/dashboard`)
- **Variables/Functions**: camelCase
- **CSS Classes**: kebab-case
- **Constants**: UPPER_SNAKE_CASE or camelCase

### Example

```typescript
// src/components/CustomButton/index.tsx
const styles = {
  button: { /* ... */ },
};

const CustomButton = ({ label, ...props }) => (
  <Button {...props} sx={styles.button}>{label}</Button>
);

export default CustomButton;
```

## Key Files Reference

### Configuration

- **`src/config.ts`**: API base URL, pagination constants
- **`src/constants/index.ts`**: Routes, enums, statuses
- **`src/constants/validation.ts`**: Yup validation schemas
- **`src/theme/index.tsx`**: MUI theme configuration

### Redux Structure

- **`src/redux/store.ts`**: Redux store configuration
- **`src/redux/slices/**/slice.ts`**: Redux state slices
- **`src/redux/slices/**/reducers.ts`**: Reducer functions
- **`src/redux/slices/**/selectors.ts`**: Redux selectors

### Services (RTK Query)

- **`src/services/base-api/index.tsx`**: Base API configuration with auth headers
- **`src/services/auth/index.ts`**: Auth endpoints
- **`src/services/users/index.ts`**: Users CRUD endpoints
- **`src/services/courses/index.ts`**: Courses CRUD endpoints

### Authentication

- **`src/contexts/AuthContext.tsx`**: Reducer-based auth context
- **`src/hooks/useAuth.tsx`**: Auth hook for context access
- **`src/GuardsAndPermissions/AuthGuard.tsx`**: Route protection
- **`src/utils/index.ts`**: Token validation, session storage helpers

## Development Workflow

### Creating a New Component

```typescript
// 1. Create folder: src/components/MyComponent/
// 2. Create file: src/components/MyComponent/index.tsx

'use client';
import { Box } from '@mui/material';

const styles = {
  wrapper: { /* ... */ },
};

interface MyComponentProps {
  title: string;
}

const MyComponent = ({ title }: MyComponentProps) => (
  <Box sx={styles.wrapper}>{title}</Box>
);

export default MyComponent;
```

### Creating a New Page

```typescript
// src/app/(dashboard)/my-feature/page.tsx

'use client';
import PageHeader from '@/components/PageHeader';
import useAuth from '@/hooks/useAuth';

const MyFeaturePage = () => {
  return (
    <>
      <PageHeader title="My Feature" />
      {/* Page content */}
    </>
  );
};

export default MyFeaturePage;
```

### Adding a New Redux Slice

1. Create `src/redux/slices/myfeature/slice.ts`
2. Create `src/redux/slices/myfeature/reducers.ts`
3. Create `src/redux/slices/myfeature/selectors.ts`
4. Register in `src/redux/store.ts`

### Adding API Endpoints

```typescript
// src/services/myfeature/index.ts

const myFeatureApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getMyFeature: builder.query({
      query: () => API_ENDPOINTS.MY_FEATURE.LIST,
      providesTags: ['MY_FEATURE'],
    }),
    // ... more endpoints
  }),
});

export const { useGetMyFeatureQuery } = myFeatureApi;
```

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

## Code Quality

### Linting

Uses ESLint with Prettier integration:

```bash
npm run lint              # Check for issues
npm run lint-fix          # Auto-fix issues
```

### Best Practices Rules

- ✓ No `console.log` in code
- ✓ All functions are arrow functions
- ✓ Styles object at top of component
- ✓ Use `@/` absolute imports
- ✓ Use ternary operators for conditionals
- ✓ Keep components small and modular
- ✓ Colocate helpers in same folder

## Authentication Flow

1. User enters credentials on login page
2. `useLoginMutation` sends credentials to API
3. API returns `accessToken`, `refreshToken`, `user`
4. `AuthContext.login()` stores tokens in session storage
5. Redux auth slice updated with tokens
6. User redirected to dashboard
7. `AuthGuard` checks authentication on protected routes
8. Token included in all API requests via base query

## Data Fetching Flow

1. Component uses RTK Query hook (e.g., `useGetUsersListQuery`)
2. Hook triggers API request via base query
3. Authorization header automatically injected
4. Response cached by RTK Query
5. Component re-renders with data
6. Mutations invalidate related tags for cache refresh

## Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Troubleshooting

### Port Already in Use

```bash
npm run dev -- -p 3001
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try build again
npm run build
```

### API Connection Issues

- Verify `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
- Check API server is running
- Verify CORS settings on backend

## Resources

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [React 18 Documentation](https://react.dev)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org)
- [MUI Documentation](https://mui.com)
- [React Hook Form Documentation](https://react-hook-form.com)

## License

This project is private and confidential.
