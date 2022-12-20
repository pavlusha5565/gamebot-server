import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { envEnum } from '../app/appConfig.module';

@Injectable()
export class TypeormConfigService {
  constructor(private configService: ConfigService) {}

  get port(): number {
    const port = Number(this.configService.get<string>('database.port'));
    if (Number.isNaN(port)) {
      return 5432;
    }
    return port;
  }

  getField(name: string): string {
    return this.configService.get<string>(`database.${name}`);
  }

  parseBool(name: string): boolean {
    return this.configService.get<string>(`database.${name}`) === 'true';
  }

  get appEnv(): string {
    return this.configService.get<string>(`database.appEnv`);
  }

  get isDevelopment(): boolean {
    return this.appEnv === envEnum.development;
  }

  createTypeormConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.getField('host'),
      port: this.port,
      username: this.getField('username'),
      password: this.getField('password'),
      database: this.getField('database'),
      // synchronize: this.isDevelopment,
      // autoLoadEntities: this.isDevelopment,
      logging: this.isDevelopment,
      entities: [
        join(__dirname, '../../', 'database/entities/**/*.entity{.ts,.js}'),
      ],
      migrations: [join(__dirname, '../../', 'database/migrations/*{.ts,.js}')],
    };
  }
}
