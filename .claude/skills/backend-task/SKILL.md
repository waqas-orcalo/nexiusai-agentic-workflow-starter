# Skill: backend-task

## Purpose
Build a complete NestJS backend feature in the `backend/` directory.
Follows the aac-monolith-starter architecture: AbstractRepository, AbstractSchema, JWT auth, soft delete.

## When to Use
- User says "build the backend for X", "create the API for X", "implement the endpoints"
- `run-workflow` skill delegates backend work during PARALLEL_DEV step
- Scope is BACKEND or FULLSTACK

## Always Read First
1. `agents/backend-agent/AGENT.md` — full rules and patterns
2. `agents/backend-agent/prompts/system.prompt.ts` — architectural rules
3. `agents/backend-agent/prompts/api.prompt.ts` — file-level generation prompts
4. `agents/types.ts` — TypeScript interfaces

## 10-Step File Creation Order (follow exactly)

### Step 1 — Add Enum Values
File: `backend/src/common/constants/enums.ts`

Add a new enum for the feature's status:
```typescript
export enum <Feature>Status {
  ACTIVE   = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}
```

### Step 2 — Add Message Constants
File: `backend/src/common/constants/messages.ts`

Add to `SUCCESS_MESSAGES`:
```typescript
<FEATURE>_CREATED: '<Feature> created successfully',
<FEATURE>S_FETCHED: '<Feature>s retrieved successfully',
<FEATURE>_FETCHED:  '<Feature> retrieved successfully',
<FEATURE>_UPDATED:  '<Feature> updated successfully',
<FEATURE>_DELETED:  '<Feature> deleted successfully',
```

Add to `ERROR_MESSAGES`:
```typescript
<FEATURE>_NOT_FOUND:   '<Feature> not found',
<FEATURE>_ALREADY_EXISTS: '<Feature> already exists',
```

### Step 3 — Create Schema
File: `backend/src/<feature>/schemas/<feature>.schema.ts`

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AbstractSchema } from '../../common/schemas/abstract.schema';

export type <Feature>Document = HydratedDocument<<Feature>>;

@Schema({ versionKey: false, timestamps: true })
export class <Feature> extends AbstractSchema {
  @Prop({ required: true, trim: true, maxlength: 200 }) title: string;
  @Prop({ trim: true }) description?: string;
  @Prop({ default: <Feature>Status.ACTIVE, enum: <Feature>Status }) status: <Feature>Status;
  // Add feature-specific fields here
}

export const <Feature>Schema = SchemaFactory.createForClass(<Feature>);
```

**Rules:**
- ALWAYS extend `AbstractSchema` (provides `_id`, `isDeleted`, `deletedBy`, `deletedAt`)
- ALWAYS use `@Schema({ versionKey: false, timestamps: true })`
- NEVER add `createdAt`/`updatedAt` manually — AbstractSchema handles it

### Step 4 — Create Repository
File: `backend/src/<feature>/<feature>.repository.ts`

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '../common/repositories/abstract.repository';
import { <Feature>, <Feature>Document } from './schemas/<feature>.schema';

@Injectable()
export class <Feature>Repository extends AbstractRepository<<Feature>Document> {
  protected readonly logger = new Logger(<Feature>Repository.name);

  constructor(
    @InjectModel(<Feature>.name) private readonly <feature>Model: Model<<Feature>Document>,
  ) {
    super(<feature>Model);
  }
}
```

**Available inherited methods (NEVER reimplement):**
- `create(doc)` — insert document
- `findOne(filter, projection?)` — find first match
- `findById(id)` — find by `_id`
- `find(filter, sort?, projection?)` — NOT `findAll()` — find array
- `findWithPagination(filter, page, limit, sort?)` — paginated results
- `updateOne(filter, update)` — update first match
- `updateById(id, update)` — update by `_id`
- `softDelete(filter, deletedBy?)` — set `isDeleted=true`
- `deleteOne(filter)` — hard delete (only for cleanup tasks)
- `count(filter)` — count matching documents
- `exists(filter)` — check existence

### Step 5 — Create Create DTO
File: `backend/src/<feature>/dto/create-<feature>.dto.ts`

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { <Feature>Status } from '../../common/constants/enums';

export class Create<Feature>Dto {
  @ApiProperty({ example: 'My <Feature>' })
  @IsString() @IsNotEmpty() @MaxLength(200)
  title: string;

  @ApiPropertyOptional({ example: 'A description' })
  @IsOptional() @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: <Feature>Status, default: <Feature>Status.ACTIVE })
  @IsOptional() @IsEnum(<Feature>Status)
  status?: <Feature>Status;
}
```

### Step 6 — Create Update DTO
File: `backend/src/<feature>/dto/update-<feature>.dto.ts`

```typescript
import { PartialType } from '@nestjs/swagger';
import { Create<Feature>Dto } from './create-<feature>.dto';

export class Update<Feature>Dto extends PartialType(Create<Feature>Dto) {}
```

### Step 7 — Create Service
File: `backend/src/<feature>/<feature>.service.ts`

```typescript
@Injectable()
export class <Feature>Service {
  private readonly logger = new Logger(<Feature>Service.name);

  constructor(private readonly <feature>Repository: <Feature>Repository) {}

  async create(dto: Create<Feature>Dto, createdBy: string) {
    const item = await this.<feature>Repository.create({ ...dto, createdBy } as any);
    return { success: true, message: SUCCESS_MESSAGES.<FEATURE>_CREATED, data: item };
  }

  async findAll(query: PaginationDto) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = SortOrder.DESC } = query;
    const filter = { isDeleted: { $ne: true } };
    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === SortOrder.ASC ? 1 : -1 };
    const result = await this.<feature>Repository.findWithPagination(filter, page, limit, sort);
    return {
      success: true,
      message: SUCCESS_MESSAGES.<FEATURE>S_FETCHED,
      data: result.data,
      meta: { total: result.total, page: result.page, limit: result.limit,
              totalPages: Math.ceil(result.total / limit) },
    };
  }

  async findOne(id: string) {
    const item = await this.<feature>Repository.findById(id);
    if (!item) throw new NotFoundException(ERROR_MESSAGES.<FEATURE>_NOT_FOUND);
    return { success: true, message: SUCCESS_MESSAGES.<FEATURE>_FETCHED, data: item };
  }

  async update(id: string, dto: Update<Feature>Dto) {
    const item = await this.<feature>Repository.updateById(id, dto as any);
    if (!item) throw new NotFoundException(ERROR_MESSAGES.<FEATURE>_NOT_FOUND);
    return { success: true, message: SUCCESS_MESSAGES.<FEATURE>_UPDATED, data: item };
  }

  async remove(id: string, deletedBy: string) {
    const item = await this.<feature>Repository.softDelete({ _id: id }, deletedBy);
    if (!item) throw new NotFoundException(ERROR_MESSAGES.<FEATURE>_NOT_FOUND);
    return { success: true, message: SUCCESS_MESSAGES.<FEATURE>_DELETED, data: null };
  }
}
```

### Step 8 — Create Controller
File: `backend/src/<feature>/<feature>.controller.ts`

```typescript
@ApiTags('<Feature>')
@ApiBearerAuth()
@Controller('<feature>')
export class <Feature>Controller {
  constructor(private readonly <feature>Service: <Feature>Service) {}

  @Post()
  @ApiOperation({ summary: 'Create <feature>' })
  @ApiResponse({ status: 201, description: '<Feature> created successfully' })
  create(@Body() dto: Create<Feature>Dto, @CurrentUser() user: JwtPayload) {
    return this.<feature>Service.create(dto, user._id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all <feature>s (paginated)' })
  findAll(@Query() query: PaginationDto) {
    return this.<feature>Service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get <feature> by ID' })
  findOne(@Param('id') id: string) {
    return this.<feature>Service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update <feature>' })
  update(@Param('id') id: string, @Body() dto: Update<Feature>Dto) {
    return this.<feature>Service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete <feature>' })
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.<feature>Service.remove(id, user._id);
  }
}
```

### Step 9 — Create Module
File: `backend/src/<feature>/<feature>.module.ts`

```typescript
@Module({
  imports: [
    MongooseModule.forFeature([{ name: <Feature>.name, schema: <Feature>Schema }]),
  ],
  controllers: [<Feature>Controller],
  providers: [<Feature>Service, <Feature>Repository],
  exports: [<Feature>Service],
})
export class <Feature>Module {}
```

### Step 10 — Register in AppModule
File: `backend/src/app.module.ts`

Add `<Feature>Module` to the `imports` array.

## Hard Rules
1. **NEVER use `Model<T>` directly** in service or controller
2. **NEVER use `findAll()`** — use `find()` or `findWithPagination()` instead
3. **NEVER use `softDelete(id)`** — use `softDelete({ _id: id }, deletedBy)`
4. **NEVER hardcode strings** — use `SUCCESS_MESSAGES` and `ERROR_MESSAGES`
5. **NEVER throw `RpcException`** — throw `NotFoundException`, `ConflictException`, etc.
6. **NEVER hard delete user data** — use `softDelete` always
7. **ALWAYS add `@ApiTags`, `@ApiOperation`, `@ApiResponse`** to controllers
8. **ALWAYS use `@CurrentUser()`** to get user from JWT — never trust req.body for userId
9. **ALWAYS add `private readonly logger`** to every service and repository

## File Checklist
- [ ] `backend/src/common/constants/enums.ts` (updated)
- [ ] `backend/src/common/constants/messages.ts` (updated)
- [ ] `backend/src/<feature>/schemas/<feature>.schema.ts`
- [ ] `backend/src/<feature>/<feature>.repository.ts`
- [ ] `backend/src/<feature>/dto/create-<feature>.dto.ts`
- [ ] `backend/src/<feature>/dto/update-<feature>.dto.ts`
- [ ] `backend/src/<feature>/<feature>.service.ts`
- [ ] `backend/src/<feature>/<feature>.controller.ts`
- [ ] `backend/src/<feature>/<feature>.module.ts`
- [ ] `backend/src/app.module.ts` (updated)

## Output Report
After completing all files, output:

```
BACKEND IMPLEMENTATION REPORT
==============================
Feature: <name>
Files Created: 10

ENDPOINTS:
- POST   /api/v1/<feature>          → Create <Feature>
- GET    /api/v1/<feature>          → List <Feature>s (paginated)
- GET    /api/v1/<feature>/:id      → Get <Feature> by ID
- PATCH  /api/v1/<feature>/:id      → Update <Feature>
- DELETE /api/v1/<feature>/:id      → Soft delete <Feature>

SWAGGER: http://localhost:3001/docs#/<Feature>

NEXT STEPS FOR FRONTEND AGENT:
- Wire up RTK Query service for: /api/v1/<feature>
- Response shapes: { success, message, data, meta? }
```
