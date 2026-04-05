// ─────────────────────────────────────────────
//  User Enums
// ─────────────────────────────────────────────
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ORG_ADMIN = 'ORG_ADMIN',
  USER = 'USER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
  DELETED = 'DELETED',
}

export enum UserGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}

// ─────────────────────────────────────────────
//  Sort & Pagination
// ─────────────────────────────────────────────
export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

// ─────────────────────────────────────────────
//  Course
// ─────────────────────────────────────────────
export enum CourseLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export enum CourseStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

// ─────────────────────────────────────────────
//  AI Model
// ─────────────────────────────────────────────
export enum AiModelCategory {
  LANGUAGE = 'Language',
  VISION = 'Vision',
  CODE = 'Code',
  IMAGE_GEN = 'Image Gen',
  AUDIO = 'Audio',
  OPEN_SOURCE = 'Open Source',
  MULTIMODAL = 'Multimodal',
}

export enum AiModelPricingModel {
  PAY_PER_USE = 'Pay Per Use',
  SUBSCRIPTION = 'Subscription',
  FREE_TIER = 'Free',
  ENTERPRISE = 'Enterprise',
}

export enum AiModelStatus {
  ACTIVE = 'ACTIVE',
  BETA = 'BETA',
  DEPRECATED = 'DEPRECATED',
}

// ─────────────────────────────────────────────
//  Agent
// ─────────────────────────────────────────────
export enum AgentTemplateType {
  RESEARCH = 'RESEARCH',
  SUPPORT = 'SUPPORT',
  CODING = 'CODING',
  DATA = 'DATA',
  MARKETING = 'MARKETING',
  SALES = 'SALES',
  CUSTOM = 'CUSTOM',
}

export enum AgentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DRAFT = 'DRAFT',
}
