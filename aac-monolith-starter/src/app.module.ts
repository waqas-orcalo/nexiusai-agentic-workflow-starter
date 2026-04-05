import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { resolve } from 'path';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

// ─── Feature Modules ───────────────────────────────────────────────────────
import { AiModelsModule } from './ai-models/ai-models.module';
import { AgentsModule } from './agents/agents.module';

// ─── Common ────────────────────────────────────────────────────────────────
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

@Module({
  imports: [
    // ─── Environment Variables ─────────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: resolve(__dirname, '..', '.env'),
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
    AiModelsModule,
    AgentsModule,
  ],
  providers: [
    // ─── Global Exception Filter ───────────────────────────────────────────
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },

    // ─── Global Response Interceptor ───────────────────────────────────────
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
