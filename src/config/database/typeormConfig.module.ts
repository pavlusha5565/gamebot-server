import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { envEnum } from '../app/appConfig.module';
import { TypeormConfig } from './typeormConfig';
import { TypeormConfigService } from './typeormConfig.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [TypeormConfig],
      validationSchema: Joi.object({
        DB_MAIN_PORT: Joi.string().default('5432'),
        DB_MAIN_HOST: Joi.string().required(),
        DB_MAIN_DATABASE: Joi.string().required(),
        DB_MAIN_USER: Joi.string().required(),
        DB_MAIN_PASSWORD: Joi.string().required(),
        APP_ENV: Joi.string()
          .valid(...Object.keys(envEnum))
          .default(envEnum.development),
      }),
    }),
  ],
  providers: [ConfigService, TypeormConfigService],
  exports: [ConfigService, TypeormConfigService],
})
export class TypeormConfigModule {}
