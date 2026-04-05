---
name: use-abstract-repo
description: >
  Read this skill BEFORE writing or editing any service method that interacts with a repository.
  It is the definitive reference for the AbstractRepository API available in the AAC Monolith project.
---

# use-abstract-repo Skill

Every repository in this project extends `AbstractRepository<TDocument>` located at:
`src/common/repositories/abstract.repository.ts`

**Never inject or use a Mongoose `Model` directly in a service.**
**Always inject the repository and call its methods.**

---

## Complete Method Reference

### `create(data)`
```typescript
const user = await this.userRepository.create({
  firstName: 'John',
  email: 'john@example.com',
  password: hashedPassword,
} as any);
```
- Creates a new document and returns it as a plain object.
- Always generates a new `Types.ObjectId` for `_id`.

---

### `findOne(filterQuery, projection?, options?)`
```typescript
// Basic
const user = await this.userRepository.findOne({ email: 'john@example.com' });

// With projection
const user = await this.userRepository.findOne(
  { email: 'john@example.com' },
  { firstName: 1, email: 1 }
);

// With options
const user = await this.userRepository.findOne(
  { _id: id },
  undefined,
  { sort: { createdAt: -1 } }
);
```
- Returns `TDocument | null`.
- Uses `.lean()` — returns plain JavaScript objects, not Mongoose documents.

---

### `findById(id, projection?)`
```typescript
const user = await this.userRepository.findById(userId);
const user = await this.userRepository.findById(userId, { email: 1, role: 1 });
```
- `id` can be `string` or `Types.ObjectId`.
- Returns `TDocument | null`.

---

### `find(filterQuery, projection?, options?)`
```typescript
// ✅ CORRECT — method is called "find", NOT "findAll"
const users = await this.userRepository.find({ role: UserRole.USER });

// With options
const users = await this.userRepository.find(
  { status: UserStatus.ACTIVE },
  undefined,
  { sort: { createdAt: -1 }, limit: 50 }
);
```
⚠️ **`findAll()` does not exist.** Always call `find()`.

---

### `findWithPagination(filterQuery, page, limit, sort?, projection?)`
```typescript
const result = await this.courseRepository.findWithPagination(
  { isDeleted: { $ne: true } },  // filter
  page,                          // page number (1-based)
  limit,                         // items per page
  { createdAt: -1 },             // sort
);

// result shape:
// { data: TDocument[], total: number, page: number, limit: number }

return {
  success: true,
  message: SUCCESS_MESSAGES.COURSES_FETCHED,
  data: result.data,
  meta: {
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: Math.ceil(result.total / result.limit),
  },
};
```

---

### `updateOne(filterQuery, update, options?)`
```typescript
const user = await this.userRepository.updateOne(
  { email: 'john@example.com' },
  { lastSeen: new Date() }
);
```
- Returns the **updated** document or `null`.
- Uses `{ new: true }` by default.

---

### `updateById(id, update)`
```typescript
const user = await this.userRepository.updateById(userId, {
  firstName: 'Jane',
  lastSeen: new Date(),
} as any);
```
- `id` can be `string` or `Types.ObjectId`.
- Returns the updated document or `null`.

---

### `softDelete(filterQuery, deletedBy?)`
```typescript
// ✅ CORRECT — pass a FilterQuery, NOT a string id
await this.userRepository.softDelete({ _id: userId }, performedByUserId);
await this.courseRepository.softDelete({ _id: courseId }, adminId);

// With compound filter
await this.userRepository.softDelete({ email: 'john@example.com' }, adminId);
```
⚠️ **`softDelete(id)` is WRONG.** The first argument is a `FilterQuery`, not a string.

Sets `isDeleted: true`, `deletedBy: string`, `deletedAt: Date`.
Returns the updated document or `null` (if not found).

---

### `deleteOne(filterQuery)`
```typescript
const deleted = await this.featureRepository.deleteOne({ _id: id });
// returns boolean
```
⚠️ Use only for **non-user-facing** data (e.g. temp records, test cleanup).
For user-facing data, always use `softDelete`.

---

### `count(filterQuery)`
```typescript
const total = await this.userRepository.count({ role: UserRole.USER, isDeleted: { $ne: true } });
```

---

### `exists(filterQuery)`
```typescript
const exists = await this.userRepository.exists({ email: dto.email.toLowerCase() });
if (exists) throw new ConflictException(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
```

---

## Common Mistakes

| ❌ Wrong | ✅ Correct |
|---|---|
| `this.userRepository.findAll()` | `this.userRepository.find(filter)` |
| `this.userRepository.softDelete(id)` | `this.userRepository.softDelete({ _id: id }, deletedBy)` |
| `new this.userModel(data)` | `this.userRepository.create(data)` |
| Injecting `@InjectModel` in service | Injecting the repository class |
| `this.userRepository.deleteOne({ _id: userId })` on user data | `this.userRepository.softDelete({ _id: userId }, deletedBy)` |

---

## Service Method Template

```typescript
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { FeatureRepository } from './feature.repository';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../common/constants/messages';

@Injectable()
export class FeatureService {
  private readonly logger = new Logger(FeatureService.name);

  constructor(private readonly featureRepository: FeatureRepository) {}

  async findOne(id: string) {
    const feature = await this.featureRepository.findById(id);

    if (!feature || (feature as any).isDeleted) {
      throw new NotFoundException(ERROR_MESSAGES.FEATURE_NOT_FOUND);
    }

    return {
      success: true,
      message: SUCCESS_MESSAGES.FEATURE_FETCHED,
      data: feature,
    };
  }

  async remove(id: string, deletedBy: string) {
    // ✅ softDelete takes a FilterQuery — not a string
    const feature = await this.featureRepository.softDelete({ _id: id }, deletedBy);

    if (!feature) {
      throw new NotFoundException(ERROR_MESSAGES.FEATURE_NOT_FOUND);
    }

    return {
      success: true,
      message: SUCCESS_MESSAGES.FEATURE_DELETED,
      data: null,
    };
  }
}
```

---

## Quick Reference Card

```
create(data)                                   → TDocument
findOne(filter, projection?, options?)         → TDocument | null
findById(id, projection?)                      → TDocument | null
find(filter, projection?, options?)            → TDocument[]          ← NOT findAll()
findWithPagination(filter, page, limit, sort?) → { data, total, page, limit }
updateOne(filter, update, options?)            → TDocument | null
updateById(id, update)                         → TDocument | null
softDelete(FilterQuery, deletedBy?)            → TDocument | null     ← NOT softDelete(id)
deleteOne(filter)                              → boolean
count(filter)                                  → number
exists(filter)                                 → boolean
```
