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
      envFilePath: ['.env', '.env.local'],
      load: [appConfig],
      validationSchema: Joi.object({
        APP_ENV: Joi.string()
          .valid(...Object.keys(envEnum))
          .default(envEnum.development),
        DB_MAIN_PORT: Joi.string().default('5432'),
        DB_MAIN_HOST: Joi.string().required(),
        DB_MAIN_DATABASE: Joi.string().required(),
        DB_MAIN_USER: Joi.string().required(),
        DB_MAIN_PASSWORD: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService, AppConfigService],
  exports: [ConfigService, AppConfigService],
})
export class AppConfigModule {}
