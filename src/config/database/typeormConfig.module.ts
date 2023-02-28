import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { envEnum } from '../app/appConfig.module';
import { TypeormRegisterConfig } from './typeormConfig';
import { TypeormConfigService } from './typeormConfig.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        '.env.local',
        '.env.development',
        '.env.production',
        '.env',
      ],
      load: [TypeormRegisterConfig],
      validationSchema: Joi.object({
        DB_MAIN_PORT: Joi.string().default('5432'),
        DB_MAIN_HOST: Joi.string().required(),
        DB_MAIN_DATABASE: Joi.string().required(),
        DB_MAIN_USER: Joi.string().required(),
        DB_MAIN_PASSWORD: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService, TypeormConfigService],
  exports: [ConfigService, TypeormConfigService],
})
export class TypeormConfigModule {}

@Module({
  imports: [
    TypeormConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [TypeormConfigModule],
      inject: [TypeormConfigService],
      useFactory: (configService: TypeormConfigService) => {
        return configService.createTypeormConfig();
      },
    }),
  ],
  providers: [ConfigService, TypeormConfigService],
  exports: [ConfigService, TypeormConfigService],
})
export class TypeormRootConfigModule {}
