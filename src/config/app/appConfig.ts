import { registerAs } from '@nestjs/config';

export interface IAppEnv {
  appEnv: string;
  host: string;
  port: number;
  jwtSecret: string;
  jwtExpiresIn: string;
  jwtRefreshSecret: string;
  jwtRefreshExpiresIn: string;
}

export const appConfig = registerAs<IAppEnv>('app', () => {
  return {
    appEnv: process.env.APP_ENV,
    host: process.env.APP_HOST,
    port: parseInt(process.env.APP_PORT),
    jwtSecret: process.env.APP_JWT_SECRET,
    jwtExpiresIn: process.env.APP_JWT_EXPIRES_IN,
    jwtRefreshSecret: process.env.APP_JWT_REFRESH_SECRET,
    jwtRefreshExpiresIn: process.env.APP_JWT_REFRESH_EXPIRES_IN,
  };
});
