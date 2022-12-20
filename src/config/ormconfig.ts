import { config } from 'dotenv';
import { join } from 'path';
import { DataSource } from 'typeorm';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_MAIN_HOST,
  port: +process.env.DB_MAIN_PORT,
  username: process.env.DB_MAIN_USER,
  password: process.env.DB_MAIN_PASSWORD,
  database: process.env.DB_MAIN_DATABASE,
  entities: [
    join(__dirname, '../../src/database/entities/**/*.entity{.ts,.js}'),
  ],
  migrations: [join(__dirname, '../../src/database/migrations/*{.ts,.js}')],
});
