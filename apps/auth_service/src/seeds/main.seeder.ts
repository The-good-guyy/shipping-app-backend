import { Permission } from '../permission/entities/permission.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { permissionData } from '../datasources/sampleData/permission.data';
import { roleData } from '../datasources/sampleData/role.data';
import { Role } from '../role/entities/role.entity';

export class MainSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const permissionRepository = dataSource.getRepository(Permission);
    const roleRepository = dataSource.getRepository(Role);
    await permissionRepository.save(permissionData);
    const [manage_routes, manage_users, read_routes, read_users] =
      await Promise.all([
        permissionRepository.findOne({
          where: {
            permission: 'manage_routes',
          },
        }),
        permissionRepository.findOne({
          where: {
            permission: 'manage_users',
          },
        }),
        permissionRepository.findOne({
          where: {
            permission: 'read_routes',
          },
        }),
        permissionRepository.findOne({
          where: {
            permission: 'read_users',
          },
        }),
      ]);
    const user_role = roleData.find((role) => role.role === 'user');
    user_role.permission = [read_routes, read_users];
    const admin_role = roleData.find((role) => role.role === 'admin');
    admin_role.permission = [manage_routes, manage_users];
    await roleRepository.save(user_role);
    await roleRepository.save(admin_role);
  }
}
