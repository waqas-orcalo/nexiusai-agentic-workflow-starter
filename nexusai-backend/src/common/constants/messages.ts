export const SUCCESS_MESSAGES = {
  // ─── Auth ───────────────────────────────────────────────────────────────
  SIGN_UP: 'User registered successfully.',
  SIGN_IN: 'Signed in successfully.',
  SIGN_OUT: 'Signed out successfully.',
  TOKEN_REFRESHED: 'Token refreshed successfully.',
  PASSWORD_CHANGED: 'Password changed successfully.',

  // ─── User ───────────────────────────────────────────────────────────────
  USER_FETCHED: 'User fetched successfully.',
  USERS_FETCHED: 'Users fetched successfully.',
  USER_UPDATED: 'User updated successfully.',
  USER_DELETED: 'User deleted successfully.',

  // ─── Course ─────────────────────────────────────────────────────────────
  COURSE_CREATED: 'Course created successfully.',
  COURSE_FETCHED: 'Course fetched successfully.',
  COURSES_FETCHED: 'Courses fetched successfully.',
  COURSE_UPDATED: 'Course updated successfully.',
  COURSE_DELETED: 'Course deleted successfully.',
};

export const ERROR_MESSAGES = {
  // ─── Auth ───────────────────────────────────────────────────────────────
  INVALID_CREDENTIALS: 'Invalid email or password.',
  EMAIL_ALREADY_EXISTS: 'A user with this email already exists.',
  USER_BLOCKED: 'This user account has been blocked.',
  USER_DELETED: 'This user account has been deleted.',
  INVALID_REFRESH_TOKEN: 'Invalid or expired refresh token.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',

  // ─── User ───────────────────────────────────────────────────────────────
  USER_NOT_FOUND: 'User not found.',

  // ─── Course ─────────────────────────────────────────────────────────────
  COURSE_NOT_FOUND: 'Course not found.',

  // ─── General ────────────────────────────────────────────────────────────
  INTERNAL_SERVER_ERROR: 'An unexpected error occurred. Please try again.',
  VALIDATION_FAILED: 'Validation failed.',
  NOT_FOUND: 'The requested resource was not found.',
  FORBIDDEN: 'You do not have permission to access this resource.',
};
