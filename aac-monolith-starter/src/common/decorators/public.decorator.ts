import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Mark a route as publicly accessible (bypasses JwtAuthGuard).
 *
 * @example
 * @Public()
 * @Post('sign-in')
 * signIn(@Body() dto: SignInDto) { ... }
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
