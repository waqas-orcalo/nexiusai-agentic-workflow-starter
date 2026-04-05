import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from '../users/users.repository';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserStatus, UserRole } from '../common/constants/enums';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../common/constants/messages';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // ─────────────────────────────────────────────
  //  Sign Up
  // ─────────────────────────────────────────────
  async signUp(dto: SignUpDto) {
    // Check email uniqueness
    const existing = await this.userRepository.findOne({
      email: dto.email.toLowerCase(),
    });

    if (existing) {
      throw new ConflictException(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 12);

    // Persist user
    const user = await this.userRepository.create({
      ...dto,
      email: dto.email.toLowerCase(),
      password: hashedPassword,
      role: dto.role ?? UserRole.USER,
      status: UserStatus.ACTIVE,
      isEmailVerified: false,
    } as any);

    // Strip sensitive fields
    const { password: _pw, refreshToken: _rt, ...safeUser } = user as any;

    return {
      success: true,
      message: SUCCESS_MESSAGES.SIGN_UP,
      data: safeUser,
    };
  }

  // ─────────────────────────────────────────────
  //  Sign In
  // ─────────────────────────────────────────────
  async signIn(dto: SignInDto) {
    // Load user including password field
    const user = await this.userRepository.findByEmailWithPassword(dto.email);

    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(dto.password, (user as any).password);
    if (!passwordMatch) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Guard against blocked / deleted accounts
    if ((user as any).status === UserStatus.BLOCKED) {
      throw new UnauthorizedException(ERROR_MESSAGES.USER_BLOCKED);
    }
    if ((user as any).isDeleted) {
      throw new UnauthorizedException(ERROR_MESSAGES.USER_DELETED);
    }

    // Generate JWT pair
    const tokens = await this.generateTokens(user);

    // Store hashed refresh token
    const hashedRefresh = await bcrypt.hash(tokens.refreshToken, 10);
    await this.userRepository.updateById((user as any)._id, {
      refreshToken: hashedRefresh,
      lastSeen: new Date(),
    } as any);

    // Strip sensitive fields
    const { password: _pw, refreshToken: _rt, ...safeUser } = user as any;

    return {
      success: true,
      message: SUCCESS_MESSAGES.SIGN_IN,
      data: { user: safeUser, ...tokens },
    };
  }

  // ─────────────────────────────────────────────
  //  Refresh Tokens
  // ─────────────────────────────────────────────
  async refreshTokens(userId: string, rawRefreshToken: string) {
    const user = await this.userRepository.findByIdWithRefreshToken(userId);

    if (!user || !(user as any).refreshToken) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
    }

    const tokenMatch = await bcrypt.compare(rawRefreshToken, (user as any).refreshToken);
    if (!tokenMatch) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
    }

    const tokens = await this.generateTokens(user);

    const hashedRefresh = await bcrypt.hash(tokens.refreshToken, 10);
    await this.userRepository.updateById((user as any)._id, {
      refreshToken: hashedRefresh,
    } as any);

    return {
      success: true,
      message: SUCCESS_MESSAGES.TOKEN_REFRESHED,
      data: tokens,
    };
  }

  // ─────────────────────────────────────────────
  //  Change Password
  // ─────────────────────────────────────────────
  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.userRepository.findByEmailWithPassword(
      (await this.userRepository.findById(userId) as any).email,
    );

    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const passwordMatch = await bcrypt.compare(dto.currentPassword, (user as any).password);
    if (!passwordMatch) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 12);
    await this.userRepository.updateById((user as any)._id, {
      password: hashedPassword,
      refreshToken: null,
    } as any);

    return {
      success: true,
      message: SUCCESS_MESSAGES.PASSWORD_CHANGED,
      data: null,
    };
  }

  // ─────────────────────────────────────────────
  //  Sign Out
  // ─────────────────────────────────────────────
  async signOut(userId: string) {
    await this.userRepository.updateById(userId, { refreshToken: null } as any);
    return {
      success: true,
      message: SUCCESS_MESSAGES.SIGN_OUT,
      data: null,
    };
  }

  // ─────────────────────────────────────────────
  //  Private: generate access + refresh token pair
  // ─────────────────────────────────────────────
  private async generateTokens(user: any) {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '7d'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '30d'),
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
