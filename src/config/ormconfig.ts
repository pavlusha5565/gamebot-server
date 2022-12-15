import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_MAIN_HOST,
  port: +process.env.DB_MAIN_PORT,
  username: process.env.DB_MAIN_USER,
  password: process.env.DB_MAIN_PASSWORD,
  database: process.env.DB_MAIN_DATABASE,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*{.ts,.js}'],
});
