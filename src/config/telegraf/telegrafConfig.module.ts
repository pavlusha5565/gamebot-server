import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { TelegrafModule } from 'nestjs-telegraf';
import { session } from 'telegraf';
import { TelegrafRegisterConfig } from './telegrafConfig';
import { TelegrafConfigService } from './telegrafConfig.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env.development', '.env'],
      load: [TelegrafRegisterConfig],
      validationSchema: Joi.object({
        TELEGRAM_API_TOKEN: Joi.string().required(),
      }),
    }),
  ],
  providers: [TelegrafConfigService],
  exports: [TelegrafConfigService],
})
export class TelegrafConfigModule {}

@Module({
  imports: [
    TelegrafConfigModule,
    TelegrafModule.forRootAsync({
      imports: [TelegrafConfigModule],
      inject: [TelegrafConfigService],
      useFactory: (configService: TelegrafConfigService) => {
        return configService.createRootConfig();
      },
    }),
  ],
})
export class TelegrafRootConfigModule {}
