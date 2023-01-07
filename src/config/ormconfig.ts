import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { TypeormRegisterConfig } from './database/typeormConfig';

ConfigModule.forRoot({
  envFilePath: ['.env.local', '.env.development', '.env'],
  load: [TypeormRegisterConfig],
  isGlobal: true,
});

const data: DataSourceOptions =
  TypeormRegisterConfig() as PostgresConnectionOptions;

export default new DataSource({
  type: 'postgres',
  host: data.host,
  port: +data.port,
  username: data.username,
  password: data.password,
  database: data.database,
  entities: data.entities,
  migrations: data.migrations,
});
