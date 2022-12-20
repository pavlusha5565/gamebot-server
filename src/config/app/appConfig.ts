import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const appConfig = registerAs<TypeOrmModuleOptions>('app', () => {
  return {
    host: process.env.APP_HOST,
    port: parseInt(process.env.APP_PORT),
    botToken: process.env.TELEGRAM_API_TOKEN,
    appEnv: process.env.APP_ENV,
  };
});
