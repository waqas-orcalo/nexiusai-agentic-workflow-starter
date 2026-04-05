---
name: make-module
description: >
  Use this skill whenever you want to scaffold a brand-new feature module in the AAC Monolith project.
  Triggers include: "add a new module", "scaffold [feature]", "create [feature] module", "add [feature] functionality".
  ALWAYS use this skill before creating any new top-level feature — it enforces the project's mandatory patterns.
---

# make-module Skill

Strictly follow every step below. Do not skip steps or invent patterns not shown here.

---

## Mandatory Rules (Non-Negotiable)

1. **No raw Mongoose models in services** — always use a repository that extends `AbstractRepository`.
2. **No hardcoded strings** — use `SUCCESS_MESSAGES` / `ERROR_MESSAGES` from `src/common/constants/messages.ts`.
3. **No `throw new Error()`** — throw NestJS HTTP exceptions (`NotFoundException`, `BadRequestException`, `ConflictException`, etc.).
4. **All schemas must extend `AbstractSchema`** — this gives soft-delete fields automatically.
5. **Soft delete always** — never call `deleteOne` on user-facing data. Call `softDelete({ _id: id }, deletedBy)`.
6. **Consistent response shape** — always return `{ success, message, data, meta? }`.
7. **Logger, not console** — use `private readonly logger = new Logger(ServiceName.name)`.

---

## Step-by-Step Checklist

### Step 1 — Create directory structure

```
src/
└── <feature>/
    ├── schemas/
    │   └── <feature>.schema.ts
    ├── dto/
    │   ├── create-<feature>.dto.ts
    │   ├── update-<feature>.dto.ts
    │   └── index.ts
    ├── <feature>.repository.ts
    ├── <feature>.service.ts
    ├── <feature>.controller.ts
    └── <feature>.module.ts
```

---

### Step 2 — Add success/error messages

File: `src/common/constants/messages.ts`

```typescript
export const SUCCESS_MESSAGES = {
  // existing...
  FEATURE_CREATED:  'Feature created successfully.',
  FEATURE_FETCHED:  'Feature fetched successfully.',
  FEATURES_FETCHED: 'Features fetched successfully.',
  FEATURE_UPDATED:  'Feature updated successfully.',
  FEATURE_DELETED:  'Feature deleted successfully.',
};

export const ERROR_MESSAGES = {
  // existing...
  FEATURE_NOT_FOUND: 'Feature not found.',
};
```

---

### Step 3 — Add enums (if needed)

File: `src/common/constants/enums.ts`

```typescript
export enum FeatureStatus {
  ACTIVE   = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
```

---

### Step 4 — Create the Mongoose Schema

File: `src/feature/schemas/feature.schema.ts`

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { AbstractSchema } from '../../common/schemas/abstract.schema';

export type FeatureDocument = HydratedDocument<Feature>;

@Schema({ versionKey: false, timestamps: true })
export class Feature extends AbstractSchema {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  description?: string;
}

export const FeatureSchema = SchemaFactory.createForClass(Feature);

// ─── Indexes ───────────────────────────────────────────────────────────────
FeatureSchema.index({ createdAt: -1 });
```

Rules:
- Always extend `AbstractSchema`.
- Add `@Schema({ versionKey: false, timestamps: true })`.
- Index all fields you'll query or sort by.

---

### Step 5 — Create the Repository

File: `src/feature/feature.repository.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '../common/repositories/abstract.repository';
import { Feature, FeatureDocument } from './schemas/feature.schema';

@Injectable()
export class FeatureRepository extends AbstractRepository<FeatureDocument> {
  constructor(
    @InjectModel(Feature.name) private readonly featureModel: Model<FeatureDocument>,
  ) {
    super(featureModel);
  }

  // Add custom query methods here as needed.
}
```

---

### Step 6 — Create DTOs

**create-feature.dto.ts**
```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateFeatureDto {
  @ApiProperty({ example: 'My Feature' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}
```

**update-feature.dto.ts**
```typescript
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateFeatureDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}
```

**index.ts**
```typescript
export * from './create-feature.dto';
export * from './update-feature.dto';
```

---

### Step 7 — Create the Service

File: `src/feature/feature.service.ts`

```typescript
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { FeatureRepository } from './feature.repository';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { SortOrder } from '../common/constants/enums';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../common/constants/messages';

@Injectable()
export class FeatureService {
  private readonly logger = new Logger(FeatureService.name);

  constructor(private readonly featureRepository: FeatureRepository) {}

  async create(dto: CreateFeatureDto) {
    const feature = await this.featureRepository.create(dto as any);
    return { success: true, message: SUCCESS_MESSAGES.FEATURE_CREATED, data: feature };
  }

  async findAll(query: PaginationDto) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = SortOrder.DESC } = query;
    const filter = { isDeleted: { $ne: true } };
    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === SortOrder.ASC ? 1 : -1 };
    const result = await this.featureRepository.findWithPagination(filter, page, limit, sort);
    return {
      success: true,
      message: SUCCESS_MESSAGES.FEATURES_FETCHED,
      data: result.data,
      meta: { total: result.total, page: result.page, limit: result.limit,
              totalPages: Math.ceil(result.total / result.limit) },
    };
  }

  async findOne(id: string) {
    const feature = await this.featureRepository.findById(id);
    if (!feature || (feature as any).isDeleted) {
      throw new NotFoundException(ERROR_MESSAGES.FEATURE_NOT_FOUND);
    }
    return { success: true, message: SUCCESS_MESSAGES.FEATURE_FETCHED, data: feature };
  }

  async update(id: string, dto: UpdateFeatureDto) {
    const feature = await this.featureRepository.updateById(id, dto as any);
    if (!feature) throw new NotFoundException(ERROR_MESSAGES.FEATURE_NOT_FOUND);
    return { success: true, message: SUCCESS_MESSAGES.FEATURE_UPDATED, data: feature };
  }

  async remove(id: string, deletedBy: string) {
    const feature = await this.featureRepository.softDelete({ _id: id }, deletedBy);
    if (!feature) throw new NotFoundException(ERROR_MESSAGES.FEATURE_NOT_FOUND);
    return { success: true, message: SUCCESS_MESSAGES.FEATURE_DELETED, data: null };
  }
}
```

---

### Step 8 — Create the Controller

File: `src/feature/feature.controller.ts`

```typescript
import { Body, Controller, Delete, Get, HttpCode, HttpStatus,
         Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FeatureService } from './feature.service';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../common/constants/enums';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Feature')
@ApiBearerAuth()
@Controller('features')
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new feature' })
  create(@Body() dto: CreateFeatureDto, @CurrentUser() user: any) {
    return this.featureService.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all features' })
  findAll(@Query() query: PaginationDto) {
    return this.featureService.findAll(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id' })
  @ApiOperation({ summary: 'Get a single feature' })
  findOne(@Param('id') id: string) {
    return this.featureService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id' })
  @ApiOperation({ summary: 'Update a feature' })
  update(@Param('id') id: string, @Body() dto: UpdateFeatureDto) {
    return this.featureService.update(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id' })
  @ApiOperation({ summary: 'Soft-delete a feature' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.featureService.remove(id, user.userId);
  }
}
```

---

### Step 9 — Create the Module

File: `src/feature/feature.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeatureController } from './feature.controller';
import { FeatureService } from './feature.service';
import { FeatureRepository } from './feature.repository';
import { Feature, FeatureSchema } from './schemas/feature.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Feature.name, schema: FeatureSchema }]),
  ],
  controllers: [FeatureController],
  providers: [FeatureService, FeatureRepository],
  exports: [FeatureRepository, FeatureService],
})
export class FeatureModule {}
```

---

### Step 10 — Register in AppModule

File: `src/app.module.ts`

```typescript
import { FeatureModule } from './feature/feature.module';

@Module({
  imports: [
    // ... existing modules
    FeatureModule,  // ← add here
  ],
})
export class AppModule {}
```

---

## Verification Checklist

Before considering the task done, confirm:

- [ ] Directory structure created correctly
- [ ] Schema extends AbstractSchema and has `{ versionKey: false, timestamps: true }`
- [ ] Repository extends AbstractRepository
- [ ] All service methods return `{ success, message, data, meta? }`
- [ ] All error messages use `ERROR_MESSAGES.*` constants
- [ ] All success messages use `SUCCESS_MESSAGES.*` constants
- [ ] Soft delete used (not hard delete) for user-facing data
- [ ] Logger used (not `console.log`)
- [ ] Module registered in `AppModule`
- [ ] DTOs have `@ApiProperty` decorators for Swagger
