import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ERROR_MESSAGES } from '../../common/constants/messages';

export interface JwtRefreshPayload {
  sub: string;
  email: string;
  role: string;
  refreshToken?: string;
}

/**
 * JWT Refresh Token strategy.
 * Extracts the Bearer token from the Authorization header,
 * validates it against JWT_REFRESH_SECRET, and attaches
 * both the payload and the raw refreshToken to request.user.
 *
 * Use with @UseGuards(AuthGuard('jwt-refresh')) on refresh endpoints.
 */
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtRefreshPayload) {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
    }

    const refreshToken = authHeader.replace('Bearer', '').trim();

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      refreshToken,
    };
  }
}
