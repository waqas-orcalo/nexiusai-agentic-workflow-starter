---
name: make-route-guard
description: >
  Use this skill whenever you need to protect a route with JWT auth, make a route public,
  or restrict access by role in the AAC Monolith project.
  Triggers: "protect route", "make public", "add auth to", "restrict to admin",
  "add @Roles", "role-based access", "guard this endpoint", "@Public".
---

# make-route-guard Skill

The monolith uses a **global** `JwtAuthGuard` registered in `AppModule`.
This means **every route is protected by default**. You only need to act when:

- **Scenario A** — You want to make a route publicly accessible (no auth).
- **Scenario B** — You want to restrict a route to specific roles.
- **Scenario C** — You want to allow any authenticated user (default — no extra work needed).

---

## Scenario A — Make a route public (no authentication required)

Use the `@Public()` decorator from `src/common/decorators/public.decorator.ts`.

```typescript
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

  // ✅ Anyone can access this — no token required
  @Public()
  @Post('sign-up')
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  // ✅ Anyone can access this — no token required
  @Public()
  @Post('sign-in')
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  // ⛔ Protected by default — valid JWT required (no @Public needed)
  @Post('sign-out')
  signOut(@CurrentUser() user: any) {
    return this.authService.signOut(user.userId);
  }
}
```

Rules:
- `@Public()` bypasses `JwtAuthGuard` entirely.
- Apply it at the **method** level, not the class level (unless all routes in the controller are public).
- Public routes should still validate DTOs normally.

---

## Scenario B — Restrict to specific roles

Use `@UseGuards(RolesGuard)` + `@Roles()` together. The user must still be authenticated (JWT valid) **and** have the required role.

```typescript
import { UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../common/constants/enums';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {

  // ✅ Any authenticated user can see their own profile
  @Get('me')
  getMyProfile(@CurrentUser() user: any) {
    return this.usersService.getMyProfile(user.userId);
  }

  // ✅ Only SUPER_ADMIN and ORG_ADMIN
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN)
  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.usersService.findAll(query);
  }

  // ✅ Only SUPER_ADMIN
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.usersService.remove(id, user.userId);
  }
}
```

Available roles (from `src/common/constants/enums.ts`):
- `UserRole.SUPER_ADMIN`
- `UserRole.ORG_ADMIN`
- `UserRole.USER`

---

## Scenario C — Any authenticated user (default)

No extra decorators needed. As long as the route is not marked `@Public()`,
`JwtAuthGuard` will require a valid Bearer token automatically.

```typescript
// ✅ Protected by default — just write your endpoint normally
@Get('me')
getMyProfile(@CurrentUser() user: any) {
  return this.usersService.getMyProfile(user.userId);
}
```

---

## Getting the current user

Inside any protected route, use `@CurrentUser()` to access the JWT payload:

```typescript
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Get('me')
getProfile(@CurrentUser() user: any) {
  console.log(user.userId); // string — MongoDB ObjectId
  console.log(user.email);  // string
  console.log(user.role);   // UserRole enum value
}
```

---

## How the guards are wired

```
src/
├── app.module.ts              ← JwtAuthGuard registered globally via APP_GUARD
├── common/
│   ├── guards/
│   │   ├── jwt-auth.guard.ts  ← Reads IS_PUBLIC_KEY; calls Passport 'jwt' strategy
│   │   └── roles.guard.ts     ← Reads ROLES_KEY; checks user.role
│   └── decorators/
│       ├── public.decorator.ts   ← Sets IS_PUBLIC_KEY = true
│       └── roles.decorator.ts    ← Sets ROLES_KEY = [roles]
└── auth/
    └── strategies/
        └── jwt.strategy.ts    ← Validates JWT; attaches { userId, email, role } to request.user
```

---

## Verification Checklist

- [ ] Public routes use `@Public()` decorator
- [ ] Role-restricted routes use both `@UseGuards(RolesGuard)` AND `@Roles(...)`
- [ ] Routes that need any auth have neither `@Public()` nor explicit guards (default is protected)
- [ ] `@CurrentUser()` is used to extract user data (not manual `req.user`)
- [ ] `@ApiBearerAuth()` is on the controller or method for protected routes in Swagger
