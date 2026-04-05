---
name: make-constants
description: >
  Use this skill whenever adding new enums, success messages, error messages, or any string constants
  to the AAC Monolith project.
  Triggers: "add enum", "add constant", "add error message", "add success message",
  "add [status/type/role] enum", "extend messages".
---

# make-constants Skill

All constants live in `src/common/constants/`. Never hardcode strings anywhere else.

---

## File Map

| What you need | File to edit |
|---|---|
| Domain enums (status, role, type, gender, level…) | `src/common/constants/enums.ts` |
| User-facing success messages | `src/common/constants/messages.ts` → `SUCCESS_MESSAGES` |
| User-facing error messages | `src/common/constants/messages.ts` → `ERROR_MESSAGES` |

All files are re-exported from `src/common/constants/index.ts` — do **not** change the barrel export unless adding a new file.

---

## Enums — `src/common/constants/enums.ts`

```typescript
// ─────────────────────────────────────────────
//  <Domain> Enums
// ─────────────────────────────────────────────
export enum FeatureStatus {
  ACTIVE   = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export enum FeatureType {
  TYPE_A = 'TYPE_A',
  TYPE_B = 'TYPE_B',
}
```

Rules:
- Enum values must match their keys (SCREAMING_SNAKE_CASE).
- Group related enums under a clear comment header.
- Never use numeric enum values for user-visible data.

---

## Success Messages — `src/common/constants/messages.ts`

```typescript
export const SUCCESS_MESSAGES = {
  // existing...

  // ─── Feature ───────────────────────────────
  FEATURE_CREATED:  'Feature created successfully.',
  FEATURE_FETCHED:  'Feature fetched successfully.',
  FEATURES_FETCHED: 'Features fetched successfully.',
  FEATURE_UPDATED:  'Feature updated successfully.',
  FEATURE_DELETED:  'Feature deleted successfully.',
};
```

Rules:
- Always end messages with a period.
- Use Title Case for entity names.
- Add only messages you actually need — do not pre-create unused ones.
- Group by domain under a comment header.

---

## Error Messages — `src/common/constants/messages.ts`

```typescript
export const ERROR_MESSAGES = {
  // existing...

  // ─── Feature ───────────────────────────────
  FEATURE_NOT_FOUND:   'Feature not found.',
  FEATURE_UNAVAILABLE: 'This feature is currently unavailable.',
  DUPLICATE_FEATURE:   'A feature with this name already exists.',
};
```

Rules:
- Always end messages with a period.
- Be specific — "Course not found." not "Not found."
- Do not duplicate existing error messages — check first.

---

## Usage in code

```typescript
// ✅ CORRECT
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../common/constants/messages';
import { FeatureStatus } from '../common/constants/enums';

throw new NotFoundException(ERROR_MESSAGES.FEATURE_NOT_FOUND);
return { success: true, message: SUCCESS_MESSAGES.FEATURE_CREATED, data: feature };
if (feature.status === FeatureStatus.ARCHIVED) { ... }

// ❌ WRONG — never hardcode
throw new NotFoundException('Feature not found.');
return { message: 'Feature created successfully.', ... };
if (feature.status === 'ARCHIVED') { ... }
```
