import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Route } from 'apps/route_service/src/route/entity/route.entity';
import { Port } from 'apps/route_service/src/port/entity/port.entity';
config({
  path: './env/postgres.env',
});
console.log('Database Host:', process.env.POSTGRES_HOST);
console.log('Database Port:', process.env.POSTGRES_PORT);
console.log('Database User:', process.env.POSTGRES_USER);
console.log('Database Password:', process.env.POSTGRES_PASSWORD);
console.log('Database Name:', process.env.POSTGRES_DB);
const PostgresDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [Route, Port],
  migrations: ['./src/migrations/*.ts'],
});

export default PostgresDataSource;
