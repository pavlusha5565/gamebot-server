import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const TypeormRegisterConfig = registerAs<TypeOrmModuleOptions>(
  'database',
  () => {
    return {
      host: process.env.DB_MAIN_HOST,
      port: parseInt(process.env.DB_MAIN_PORT),
      username: process.env.DB_MAIN_USER,
      password: process.env.DB_MAIN_PASSWORD,
      database: process.env.DB_MAIN_DATABASE,
      appEnv: process.env.APP_ENV,
    };
  },
);
