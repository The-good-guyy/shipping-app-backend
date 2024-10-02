import { User } from '../users/entities/user.entity';
import { Permission } from '../permission/entities/permission.entity';
import { Role } from '../role/entities/role.entity';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config({
  path: './env/postgres.env',
});
const PostgresDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User, Permission, Role],
  migrations: ['./src/migrations/*.ts'],
});

export default PostgresDataSource;
