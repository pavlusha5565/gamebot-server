import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegrafModuleOptions } from 'nestjs-telegraf';
import { createPostgreSQLSession } from 'src/common/middlewares/telegramSession.middleware';

export interface AppConfig {
  host: string;
  port: number;
  env: string;
  development: boolean;
}

@Injectable()
export class TelegrafConfigService {
  constructor(private configService: ConfigService) {}

  getField(name: string): string {
    return this.configService.get<string>(`telegraf.${name}`);
  }

  get token(): string {
    return this.configService.get<string>(`telegraf.token`);
  }

  createRootConfig(): TelegrafModuleOptions {
    const sessionMiddleware = createPostgreSQLSession();

    return {
      token: this.token,
      middlewares: [sessionMiddleware],
    };
  }
}
