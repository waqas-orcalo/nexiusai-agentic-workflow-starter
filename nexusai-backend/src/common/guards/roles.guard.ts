import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../constants/enums';
import { ERROR_MESSAGES } from '../constants/messages';

/**
 * Role-based access control guard.
 * Works with the @Roles() decorator.
 * Must be used AFTER JwtAuthGuard (user must already be authenticated).
 *
 * @example
 * @UseGuards(RolesGuard)
 * @Roles(UserRole.SUPER_ADMIN)
 * @Get('admin')
 * getAdminData() { ... }
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles restriction is set, allow access
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!requiredRoles.includes(user?.role)) {
      throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN);
    }

    return true;
  }
}
