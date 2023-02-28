import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAppEnv } from './appConfig';
import { envEnum } from './appConfig.module';

export interface AppConfig {
  host: string;
  port: number;
  env: string;
  development: boolean;
  jwtSecret: string;
  jwtExpiresIn: string;
}

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get port(): number {
    const port = Number(this.configService.get<string>('app.port'));
    if (Number.isNaN(port)) {
      return 3000;
    }
    return port;
  }

  getField(name: keyof IAppEnv): string {
    return this.configService.get<string>(`app.${name}`);
  }

  parseBool(name: keyof IAppEnv): boolean {
    return this.configService.get<string>(`app.${name}`) === 'true';
  }

  get appEnv(): string {
    return this.configService.get<string>(`app.appEnv`);
  }

  get isDevelopment(): boolean {
    return this.appEnv === envEnum.development;
  }

  createAppConfig(): AppConfig {
    return {
      host: this.getField('host'),
      port: this.port,
      env: this.getField('appEnv'),
      jwtSecret: this.getField('jwtSecret'),
      jwtExpiresIn: this.getField('jwtExpiresIn'),
      development: this.isDevelopment,
    };
  }
}
