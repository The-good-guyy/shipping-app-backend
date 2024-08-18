import { DataSource } from 'typeorm';
import { runSeeders, Seeder, SeederFactoryManager } from 'typeorm-extension';
import { UserSeeder } from './user.seeder';
import { permissionSeeder } from './permisson.seeder';
import { RoleSeeder } from './role.seeder';
import { permissionFactory } from '../datasources/factory/permission.factory';
import { roleFactory } from '../datasources/factory/role.factory';
import { userFactory } from '../datasources/factory/user.factory';

export default class InitSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    await runSeeders(dataSource, {
      seeds: [permissionSeeder, RoleSeeder, UserSeeder],
      factories: [permissionFactory, roleFactory, userFactory],
    });
  }
}
