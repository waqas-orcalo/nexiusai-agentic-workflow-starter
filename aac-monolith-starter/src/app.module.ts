import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { resolve } from 'path';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

// ─── Feature Modules ───────────────────────────────────────────────────────
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';

// ─── Common ────────────────────────────────────────────────────────────────
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

@Module({
  imports: [
    // ─── Environment Variables ─────────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      // Resolve from compiled `dist/` or `src/` so .env loads even when cwd is not the project root.
      envFilePath: resolve(__dirname, '..', '.env'),
      validate: (config: Record<string, unknown>) => {
        const jwt = config.JWT_SECRET;
        const refresh = config.JWT_REFRESH_SECRET;
        if (typeof jwt !== 'string' || !jwt.trim()) {
          throw new Error(
            'JWT_SECRET is missing or empty. Add it to .env (see .env.example). If JWT_SECRET exists in your shell or system environment as an empty value, remove it — it overrides .env.',
          );
        }
        if (typeof refresh !== 'string' || !refresh.trim()) {
          throw new Error(
            'JWT_REFRESH_SECRET is missing or empty. Add it to .env (see .env.example).',
          );
        }
        return config;
      },
    }),

    // ─── Database ─────────────────────────────────────────────────────────
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      }),
    }),

    // ─── Feature Modules ──────────────────────────────────────────────────
    AuthModule,
    UsersModule,
    CoursesModule,
  ],
  providers: [
    // ─── Global Exception Filter ───────────────────────────────────────────
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },

    // ─── Global JWT Auth Guard ─────────────────────────────────────────────
    // All routes are protected by default.
    // Use @Public() on routes that should be publicly accessible.
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },

    // ─── Global Response Interceptor ───────────────────────────────────────
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
