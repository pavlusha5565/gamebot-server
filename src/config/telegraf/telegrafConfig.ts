import { registerAs } from '@nestjs/config';
import { TelegrafModuleOptions } from 'nestjs-telegraf';

export const TelegrafRegisterConfig = registerAs<TelegrafModuleOptions>(
  'telegraf',
  (): TelegrafModuleOptions => {
    return {
      token: process.env.TELEGRAM_API_TOKEN,
    };
  },
);
