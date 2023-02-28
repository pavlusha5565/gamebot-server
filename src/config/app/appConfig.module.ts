import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { appConfig } from './appConfig';
import { AppConfigService } from './appConfig.service';

export enum envEnum {
  development = 'development',
  production = 'production',
  test = 'test',
}

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        '.env.local',
        '.env.development',
        '.env.production',
        '.env',
      ],
      load: [appConfig],
      validationSchema: Joi.object({
        APP_ENV: Joi.string()
          .valid(...Object.keys(envEnum))
          .default(envEnum.development),
        APP_HOST: Joi.string().default('localhost'),
        APP_PORT: Joi.string().default('3001'),
        APP_JWT_SECRET: Joi.string().required(),
        APP_JWT_EXPIRES_IN: Joi.string().default('600s'),
        APP_JWT_REFRESH_SECRET: Joi.string().required(),
        APP_JWT_REFRESH_EXPIRES_IN: Joi.string().default('1d'),
      }),
    }),
  ],
  providers: [ConfigService, AppConfigService],
  exports: [ConfigService, AppConfigService],
})
export class AppConfigModule {}
