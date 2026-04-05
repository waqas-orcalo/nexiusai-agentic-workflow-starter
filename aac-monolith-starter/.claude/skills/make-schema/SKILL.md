---
name: make-schema
description: >
  Use this skill whenever adding a new Mongoose schema, document type, or repository.
  Triggers include: "add schema", "create model", "add [entity] schema", "new collection",
  "add [entity] to database", "create repository for".
---

# make-schema Skill

Strictly follow every step below.

---

## Mandatory Rules

1. **Always extend `AbstractSchema`** — gives soft-delete fields automatically.
2. **Always use `@Schema({ versionKey: false, timestamps: true })`**.
3. **Always create a corresponding repository** that extends `AbstractRepository`.
4. **Register the schema in the module's `MongooseModule.forFeature()`** — not globally.
5. **Export the repository** from the module so other modules can use it.

---

## Step 1 — Add enums (if needed)

File: `src/common/constants/enums.ts`

```typescript
export enum FeatureStatus {
  ACTIVE   = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}
```

---

## Step 2 — Create the Schema

File: `src/<feature>/schemas/<feature>.schema.ts`

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { AbstractSchema } from '../../common/schemas/abstract.schema';
import { FeatureStatus } from '../../common/constants/enums';

export type FeatureDocument = HydratedDocument<Feature>;

@Schema({ versionKey: false, timestamps: true })
export class Feature extends AbstractSchema {
  // ─── Required Fields ─────────────────────────────────────────────────────
  @Prop({ required: true, trim: true })
  name: string;

  // ─── Optional Fields ─────────────────────────────────────────────────────
  @Prop({ trim: true })
  description?: string;

  // ─── Enum Field ──────────────────────────────────────────────────────────
  @Prop({ enum: FeatureStatus, default: FeatureStatus.ACTIVE })
  status: string;

  // ─── Reference ───────────────────────────────────────────────────────────
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  createdBy: string;

  // ─── Nested Object ───────────────────────────────────────────────────────
  @Prop({
    type: { key: String, value: String },
    _id: false,
  })
  metadata?: { key?: string; value?: string };
}

export const FeatureSchema = SchemaFactory.createForClass(Feature);

// ─── Indexes ───────────────────────────────────────────────────────────────
// Add indexes for every field you filter, sort, or query by
FeatureSchema.index({ status: 1 });
FeatureSchema.index({ createdAt: -1 });
FeatureSchema.index({ createdBy: 1 });
```

Schema rules:
- All `select: false` fields (e.g. tokens, passwords) must be explicitly selected when needed.
- Use `SchemaTypes.ObjectId` for references to other collections.
- Use `_id: false` on nested objects to avoid MongoDB adding extra `_id` fields.
- Do **not** add `email` unique index twice — it's already set by `unique: true` in `@Prop`.

---

## Step 3 — Create the Repository

File: `src/<feature>/<feature>.repository.ts`

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

  // ─── Custom queries ───────────────────────────────────────────────────────
  // Add domain-specific queries here.
  // Example: find by status, include hidden fields, compound filters, etc.
  //
  // async findActiveByCreator(createdBy: string): Promise<FeatureDocument[]> {
  //   return this.featureModel
  //     .find({ createdBy, status: FeatureStatus.ACTIVE, isDeleted: { $ne: true } })
  //     .lean<FeatureDocument[]>(true);
  // }
}
```

---

## Step 4 — Register in Module

File: `src/<feature>/<feature>.module.ts`

```typescript
import { MongooseModule } from '@nestjs/mongoose';
import { Feature, FeatureSchema } from './schemas/feature.schema';
import { FeatureRepository } from './feature.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Feature.name, schema: FeatureSchema }]),
  ],
  providers: [FeatureRepository],
  exports: [FeatureRepository],
})
export class FeatureModule {}
```

---

## Verification Checklist

- [ ] Schema extends `AbstractSchema`
- [ ] `@Schema({ versionKey: false, timestamps: true })` present
- [ ] All queried/sorted fields have indexes
- [ ] Repository extends `AbstractRepository<FeatureDocument>`
- [ ] Schema registered in `MongooseModule.forFeature()`
- [ ] Repository exported from module
