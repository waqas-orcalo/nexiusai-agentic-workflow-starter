import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../constants/enums';

export const ROLES_KEY = 'roles';

/**
 * Restrict a route to one or more roles.
 * Must be used in combination with RolesGuard.
 *
 * @example
 * @Roles(UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN)
 * @Get('admin/users')
 * getUsers() { ... }
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
