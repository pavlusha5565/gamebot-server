import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { envEnum } from './appConfig.module';

export interface AppConfig {
  host: string;
  port: number;
  env: string;
  development: boolean;
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

  getField(name: string): string {
    return this.configService.get<string>(`app.${name}`);
  }

  parseBool(name: string): boolean {
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
      development: this.isDevelopment,
    };
  }
}
