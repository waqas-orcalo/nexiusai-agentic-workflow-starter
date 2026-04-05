---
name: make-api
description: >
  Use this skill whenever the user wants to add a new API endpoint, route, controller method,
  or service method to an existing module in the AAC Monolith project.
  Triggers include: "add endpoint", "create API", "add route", "new controller method",
  "add [feature] API", "extend [module] with".
  ALWAYS use this skill before writing any controller or service method.
---

# make-api Skill

Strictly follow every step below in order. Do not skip steps.

---

## Mandatory Rules

1. **No raw Mongoose models** — always use the module's repository.
2. **No hardcoded strings** — use constants from `src/common/constants/`.
3. **No `throw new Error()`** — throw NestJS HTTP exceptions.
4. **Consistent response shape** — `{ success, message, data, meta? }`.
5. **Soft delete** — call `softDelete({ _id: id }, deletedBy)`, never `deleteOne`.
6. **Logger** — never `console.log`.

---

## Step 1 — Add success/error message constants (if new)

File: `src/common/constants/messages.ts`

```typescript
export const SUCCESS_MESSAGES = {
  // existing...
  FEATURE_ACTION: 'Feature action completed successfully.',
};

export const ERROR_MESSAGES = {
  // existing...
  FEATURE_NOT_FOUND: 'Feature not found.',
};
```

---

## Step 2 — Create or update the DTO

Directory: `src/<feature>/dto/`

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ActionDto {
  @ApiProperty({ example: 'value' })
  @IsNotEmpty()
  @IsString()
  field: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  optionalField?: string;
}
```

Export it from `src/<feature>/dto/index.ts`.

---

## Step 3 — Add the service method

File: `src/<feature>/<feature>.service.ts`

```typescript
async myAction(id: string, dto: ActionDto, performedBy: string) {
  const item = await this.featureRepository.findById(id);
  if (!item || (item as any).isDeleted) {
    throw new NotFoundException(ERROR_MESSAGES.FEATURE_NOT_FOUND);
  }

  const updated = await this.featureRepository.updateById(id, { ...dto } as any);

  return {
    success: true,
    message: SUCCESS_MESSAGES.FEATURE_ACTION,
    data: updated,
  };
}
```

Service method rules:
- Always import `Logger` and log errors: `this.logger.error('myAction error', err)`.
- Throw HTTP exceptions, not generic errors.
- Strip sensitive fields (password, refreshToken) before returning user data.

---

## Step 4 — Add the controller endpoint

File: `src/<feature>/<feature>.controller.ts`

```typescript
// ─────────────────────────────────────────────
//  POST /features/:id/action
// ─────────────────────────────────────────────
@Post(':id/action')
@HttpCode(HttpStatus.OK)
@ApiBearerAuth()
@ApiOperation({ summary: 'Perform an action on a feature' })
@ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
@ApiResponse({ status: 200, description: 'Action completed.' })
@ApiResponse({ status: 404, description: 'Feature not found.' })
myAction(
  @Param('id') id: string,
  @Body() dto: ActionDto,
  @CurrentUser() user: any,
) {
  return this.featureService.myAction(id, dto, user.userId);
}
```

Controller rules:
- Always add `@ApiOperation`, `@ApiResponse`, `@ApiParam` for Swagger.
- Use `@HttpCode` to set the correct status code.
- Delegate everything to the service — no business logic in controllers.
- Use `@CurrentUser()` to extract the authenticated user.
- Protect with `@UseGuards(RolesGuard)` + `@Roles()` if role restriction is needed.

---

## Step 5 — Route protection (if needed)

To restrict access by role:

```typescript
@UseGuards(RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN)
@Post()
create(...) { ... }
```

To make a route public (no auth required):

```typescript
@Public()
@Get()
list(...) { ... }
```

Refer to `make-route-guard` skill for more details.

---

## Verification Checklist

- [ ] Constants defined in `messages.ts` (no hardcoded strings)
- [ ] DTO has `@ApiProperty` decorators
- [ ] Service method returns `{ success, message, data }`
- [ ] Controller has `@ApiOperation` + `@ApiResponse`
- [ ] Route is protected correctly (or marked @Public if intentional)
- [ ] No `console.log` — uses Logger
