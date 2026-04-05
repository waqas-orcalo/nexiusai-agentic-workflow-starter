# CLAUDE.md — AAC Monolith Starter

> This file is the primary reference for Claude (AI assistant) when working in this repository.
> Keep it up-to-date as the project evolves.

---

## ⚡ Skills — Use These First

Before writing any code, check if a skill applies. Skills are in `.claude/skills/` and contain
ready-made templates that eliminate repetitive decisions and minimise mistakes.

| Task | Skill to invoke |
|---|---|
| Add a brand-new feature module (full scaffold) | `.claude/skills/make-module/SKILL.md` |
| Add a new API endpoint / route / controller method | `.claude/skills/make-api/SKILL.md` |
| Add a new Mongoose schema / model / repository | `.claude/skills/make-schema/SKILL.md` |
| Add enums, success/error message strings | `.claude/skills/make-constants/SKILL.md` |
| Protect routes, add @Public(), add role-based @Roles() guard | `.claude/skills/make-route-guard/SKILL.md` |
| Write or edit ANY service method that calls a repository | `.claude/skills/use-abstract-repo/SKILL.md` |

**How to invoke:** Read the relevant SKILL.md file first, then follow its checklist step-by-step.

> **Skill selection guide:**
> - Adding a whole new feature (e.g. `notifications`, `orders`, `payments`) → **make-module**
> - Adding endpoints to an **existing** module → **make-api**
> - Adding a new data model to an existing module → **make-schema**
> - Adding any string constant or enum → **make-constants**
> - Protecting a route, adding @Public(), or restricting by role → **make-route-guard**
> - Writing/editing a service that calls a repository method → **use-abstract-repo** ← read this before every service write

---

## ⛔ Hard Rules — Violations Will Be Rejected

These are non-negotiable constraints enforced on every code change in this repo.

### 1. Always Use AbstractRepository — Never Raw Mongoose Models

```typescript
// ✅ CORRECT — inject and use the repository
constructor(private readonly userRepository: UserRepository) {}
const user = await this.userRepository.findById(id);

// ❌ WRONG — never inject or use Model directly in services
constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
const user = await this.userModel.findById(id);
```

`AbstractRepository` provides these methods — use the **exact names** below:

| Method | Signature |
|---|---|
| `create` | `(data) → TDocument` |
| `findOne` | `(filterQuery, projection?, options?) → TDocument \| null` |
| `findById` | `(id: string \| ObjectId, projection?) → TDocument \| null` |
| `find` | `(filterQuery, projection?, options?) → TDocument[]` ← **NOT** `findAll` |
| `findWithPagination` | `(filter, page, limit, sort?, projection?) → { data, total, page, limit }` |
| `updateOne` | `(filterQuery, update, options?) → TDocument \| null` |
| `updateById` | `(id, update) → TDocument \| null` |
| `softDelete` | `(filterQuery: FilterQuery, deletedBy?) → TDocument \| null` ← **NOT** a plain string |
| `deleteOne` | `(filterQuery) → boolean` |
| `count` | `(filterQuery) → number` |
| `exists` | `(filterQuery) → boolean` |

⚠️ **Two rules that have broken builds before:**
- `findAll()` does **not exist** — call `find()` instead
- `softDelete(id)` is **wrong** — call `softDelete({ _id: id })` (it takes a FilterQuery)

### 2. No Hardcoded Strings — Always Use Constants

```typescript
// ✅ CORRECT
throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND)
return { message: SUCCESS_MESSAGES.SIGN_IN, ... }
if (user.status === UserStatus.BLOCKED) { ... }

// ❌ WRONG
throw new NotFoundException('User not found.')
return { message: 'Signed in successfully.', ... }
if (user.status === 'BLOCKED') { ... }
```

Constants live in `src/common/constants/`:
- `enums.ts` — `UserRole`, `UserStatus`, `CourseLevel`, all domain enums
- `messages.ts` — `SUCCESS_MESSAGES.*` and `ERROR_MESSAGES.*`

### 3. Throw HTTP Exceptions (Not Generic Errors)

```typescript
// ✅ CORRECT — in any service
import { NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';

throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
throw new ConflictException(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS);

// ❌ WRONG
throw new Error('User not found.');
throw { message: 'Email exists.', status: 409 };
```

### 4. Consistent Response Shape

Every service method must return one of these shapes:

```typescript
// Standard response
return {
  success: true,
  message: SUCCESS_MESSAGES.USER_FETCHED,
  data: user,
};

// Paginated response
return {
  success: true,
  message: SUCCESS_MESSAGES.USERS_FETCHED,
  data: result.data,
  meta: {
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: Math.ceil(result.total / result.limit),
  },
};

// Delete / action with no return data
return {
  success: true,
  message: SUCCESS_MESSAGES.USER_DELETED,
  data: null,
};
```

### 5. All Schemas Must Extend AbstractSchema

```typescript
// ✅ CORRECT
import { AbstractSchema } from '../../common/schemas/abstract.schema';

@Schema({ versionKey: false, timestamps: true })
export class Feature extends AbstractSchema { ... }

// ❌ WRONG
export class Feature { ... }  // missing AbstractSchema
```

`AbstractSchema` provides: `_id`, `isDeleted`, `deletedBy`, `deletedAt`.

### 6. Soft Delete — Never Hard Delete User-Facing Data

```typescript
// ✅ CORRECT
await this.userRepository.softDelete({ _id: id }, deletedBy);

// ❌ WRONG — hard deleting user-facing data
await this.userRepository.deleteOne({ _id: id });
```

`deleteOne` is only acceptable for non-user-facing, temporary, or system records.

### 7. Logger — Never console.log

```typescript
// ✅ CORRECT
private readonly logger = new Logger(ServiceName.name);
this.logger.log('Processing...');
this.logger.error('signIn error', err);
this.logger.warn('Suspicious activity', data);

// ❌ WRONG
console.log('Processing...');
console.error('signIn error', err);
```

### 8. Route Protection — Always Explicit

The global `JwtAuthGuard` protects all routes by default. Be explicit about exceptions:

```typescript
// ✅ Public route — explicitly marked
@Public()
@Post('sign-in')
signIn() { ... }

// ✅ Role-restricted — explicitly declared
@UseGuards(RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
@Delete(':id')
remove() { ... }

// ✅ Any authenticated user — implicit (no decorator needed)
@Get('me')
getProfile() { ... }
```

Never comment out or bypass the global auth guard without explicit justification.

---

## Project Overview

### Architecture

```
aac-monolith-starter/
├── src/
│   ├── main.ts                    # Bootstrap (Swagger, ValidationPipe, CORS, global prefix)
│   ├── app.module.ts              # Root module (MongoDB, all feature modules, global providers)
│   ├── common/                    # Shared utilities used by all feature modules
│   │   ├── constants/             # enums.ts, messages.ts, index.ts
│   │   ├── decorators/            # @Public(), @Roles(), @CurrentUser()
│   │   ├── filters/               # AllExceptionsFilter (global)
│   │   ├── guards/                # JwtAuthGuard (global), RolesGuard
│   │   ├── interceptors/          # ResponseInterceptor (global)
│   │   ├── repositories/          # AbstractRepository (base class)
│   │   ├── schemas/               # AbstractSchema (base class)
│   │   ├── dto/                   # PaginationDto
│   │   └── index.ts               # Barrel export
│   ├── auth/                      # Authentication module
│   │   ├── strategies/            # jwt.strategy.ts, jwt-refresh.strategy.ts
│   │   ├── dto/                   # sign-up, sign-in, change-password, refresh-token
│   │   ├── auth.controller.ts     # POST /auth/sign-up, sign-in, refresh, change-password, sign-out
│   │   ├── auth.service.ts        # signUp, signIn, refreshTokens, changePassword, signOut
│   │   └── auth.module.ts
│   ├── users/                     # User management module
│   │   ├── schemas/               # user.schema.ts
│   │   ├── dto/                   # update-user.dto.ts
│   │   ├── users.repository.ts    # Extends AbstractRepository + custom queries
│   │   ├── users.service.ts       # getMyProfile, updateMyProfile, findAll, findOne, remove
│   │   ├── users.controller.ts    # GET/PATCH /users/me, GET/DELETE /users/:id
│   │   └── users.module.ts
│   └── courses/                   # Course management module (example feature)
│       ├── schemas/               # course.schema.ts
│       ├── dto/                   # create-course, update-course
│       ├── courses.repository.ts
│       ├── courses.service.ts
│       ├── courses.controller.ts
│       └── courses.module.ts
├── .claude/
│   ├── CLAUDE.md                  # This file
│   └── skills/                    # AI code generation skills
└── ...config files
```

### Key Differences from Microservices Architecture

| Microservices (aac-backend-starter) | Monolith (this project) |
|---|---|
| NX monorepo with multiple apps | Single NestJS app |
| RabbitMQ message broker | Direct service method calls |
| `@MessagePattern` handlers | Standard HTTP `@Get`, `@Post`, etc. |
| `RpcException` in microservices | NestJS HTTP exceptions everywhere |
| `libs/shared` cross-service library | `src/common` shared within the app |
| Separate gateway + service processes | Single process, single codebase |
| `@shared` path alias | `@common` path alias |
| RMQ_MESSAGES constants needed | No message constants needed |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS 10 with TypeScript 5 |
| Database | MongoDB with Mongoose ODM |
| Authentication | JWT (access + refresh tokens) via passport-jwt |
| Password Hashing | bcryptjs (12 rounds for signup, 10 for refresh tokens) |
| Validation | class-validator + class-transformer |
| API Documentation | Swagger (@nestjs/swagger) |
| HTTP Server | Express (default NestJS platform) |
| Logging | NestJS built-in Logger |

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | HTTP server port | `3000` |
| `DATABASE_URL` | MongoDB connection string | `mongodb://root:password@localhost:27017/aac_db?authSource=admin` |
| `JWT_SECRET` | Access token signing secret | `your-secret-key` |
| `JWT_EXPIRES_IN` | Access token expiry | `7d` |
| `JWT_REFRESH_SECRET` | Refresh token signing secret | `your-refresh-secret` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry | `30d` |
| `SWAGGER_USERNAME` | Swagger basic auth username | `admin` |
| `SWAGGER_PASSWORD` | Swagger basic auth password | `admin123` |

---

## Local Development

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Install dependencies
npm install

# 3. Start MongoDB with Docker
docker-compose up -d

# 4. Start the app in watch mode
npm run start:dev
```

App: http://localhost:3000/api/v1
Swagger: http://localhost:3000/docs

---

## API Endpoints

### Auth (all public)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/sign-up` | None | Register new user |
| POST | `/api/v1/auth/sign-in` | None | Sign in, get tokens |
| POST | `/api/v1/auth/refresh` | Refresh Token | Get new access token |
| POST | `/api/v1/auth/change-password` | JWT | Change own password |
| POST | `/api/v1/auth/sign-out` | JWT | Invalidate refresh token |

### Users

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/users/me` | JWT | Get own profile |
| PATCH | `/api/v1/users/me` | JWT | Update own profile |
| GET | `/api/v1/users` | JWT + SUPER_ADMIN or ORG_ADMIN | List all users |
| GET | `/api/v1/users/:id` | JWT + SUPER_ADMIN or ORG_ADMIN | Get user by ID |
| DELETE | `/api/v1/users/:id` | JWT + SUPER_ADMIN | Soft-delete user |

### Courses

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/courses` | JWT + Admin | Create course |
| GET | `/api/v1/courses` | JWT | List courses |
| GET | `/api/v1/courses/:id` | JWT | Get course |
| PATCH | `/api/v1/courses/:id` | JWT + Admin | Update course |
| DELETE | `/api/v1/courses/:id` | JWT + SUPER_ADMIN | Delete course |

---

## Architecture & Key Patterns

### Global Providers (AppModule)

Three providers are registered globally in `AppModule`:

1. **`AllExceptionsFilter`** (`APP_FILTER`) — catches all exceptions and formats them consistently.
2. **`JwtAuthGuard`** (`APP_GUARD`) — validates JWT on every request. Use `@Public()` to bypass.
3. **`ResponseInterceptor`** (`APP_INTERCEPTOR`) — wraps all successful responses in the standard envelope.

### Authentication Flow

```
POST /auth/sign-in
  → AuthController.signIn(dto)
    → AuthService.signIn(dto)
      → UserRepository.findByEmailWithPassword(email)   ← includes password field
      → bcrypt.compare(dto.password, user.password)
      → JwtService.signAsync(payload, { secret: JWT_SECRET })     → accessToken
      → JwtService.signAsync(payload, { secret: JWT_REFRESH_SECRET }) → refreshToken
      → UserRepository.updateById(userId, { refreshToken: hashed })
      → return { success, message, data: { user, accessToken, refreshToken } }
```

### Token Refresh Flow

```
POST /auth/refresh (Authorization: Bearer <refreshToken>)
  → AuthGuard('jwt-refresh')        ← JwtRefreshStrategy validates the refresh token
    → AuthController.refreshTokens(user)
      → AuthService.refreshTokens(userId, rawRefreshToken)
        → UserRepository.findByIdWithRefreshToken(userId)
        → bcrypt.compare(rawRefreshToken, user.refreshToken)  ← verify match
        → Generate new token pair
        → Update stored refresh token
```

### Repository Pattern

```
Controller → Service → Repository → MongoDB
              ↑
         Business logic
         (validation, mapping,
          error throwing)
```

Services never interact with MongoDB directly.
Repositories never contain business logic.

### Module Isolation

Each feature module manages its own:
- Mongoose schema registration (`MongooseModule.forFeature`)
- Repository provider
- Service provider
- Controller

Cross-module dependencies are handled via `exports` + `imports`.

### Soft Delete

All user-facing entities inherit from `AbstractSchema` which adds:
- `isDeleted: boolean` (default false, hidden from queries via `select: false`)
- `deletedBy: string` (who deleted it, hidden)
- `deletedAt: Date` (when it was deleted, hidden)

Always filter with `isDeleted: { $ne: true }` or use `findWithPagination` which handles this.

### Password Handling

- Stored with `bcryptjs` at 12 rounds.
- `password` field has `select: false` in the schema — use `findByEmailWithPassword()` when you need it.
- Refresh tokens are also hashed before storage and never returned to the client.

---

## Adding a New Feature

Follow the `make-module` skill for a full walkthrough. High-level steps:

1. Add messages to `src/common/constants/messages.ts`
2. Add enums to `src/common/constants/enums.ts` (if needed)
3. Create `src/<feature>/schemas/<feature>.schema.ts`
4. Create `src/<feature>/<feature>.repository.ts`
5. Create DTOs in `src/<feature>/dto/`
6. Create `src/<feature>/<feature>.service.ts`
7. Create `src/<feature>/<feature>.controller.ts`
8. Create `src/<feature>/<feature>.module.ts`
9. Register module in `src/app.module.ts`

---

## Code Style Rules

- `singleQuote: true`, `trailingComma: all`, `printWidth: 100`, `semi: true`
- Run `npm run format` before committing
- Run `npm run lint` to check for issues
- Never use `any` without a type cast comment explaining why
- Group imports: NestJS → third-party → internal (constants → schemas → repositories → services)

---

## Build & Deployment

```bash
# Build for production
npm run build

# Run production build
npm run start:prod

# Docker build
docker build -t aac-monolith .

# Docker run
docker run -p 3000:3000 --env-file .env aac-monolith
```
