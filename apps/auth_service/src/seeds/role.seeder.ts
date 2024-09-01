import { Permission } from '../permission/entities/permission.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { roleData } from '../datasources/sampleData/role.data';
import { Role } from '../role/entities/role.entity';

export class RoleSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const permissionRepository = dataSource.getRepository(Permission);
    const roleRepository = dataSource.getRepository(Role);
    const [
      read_routes,
      read_users,
      read_own_routes,
      read_own_users,
      create_routes,
      create_users,
      delete_users,
      delete_own_users,
      delete_routes,
      delete_own_routes,
      update_users,
      update_routes,
      update_own_users,
      update_own_routes,
    ] = await Promise.all([
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
      permissionRepository.findOne({
        where: {
          permission: 'read_own_routes',
        },
      }),
      permissionRepository.findOne({
        where: {
          permission: 'read_own_users',
        },
      }),
      permissionRepository.findOne({
        where: {
          permission: 'create_routes',
        },
      }),
      permissionRepository.findOne({
        where: {
          permission: 'create_users',
        },
      }),
      permissionRepository.findOne({
        where: {
          permission: 'delete_users',
        },
      }),
      permissionRepository.findOne({
        where: {
          permission: 'delete_own_users',
        },
      }),
      permissionRepository.findOne({
        where: {
          permission: 'delete_routes',
        },
      }),
      permissionRepository.findOne({
        where: {
          permission: 'delete_own_routes',
        },
      }),
      permissionRepository.findOne({
        where: {
          permission: 'update_users',
        },
      }),
      permissionRepository.findOne({
        where: {
          permission: 'update_routes',
        },
      }),
      permissionRepository.findOne({
        where: {
          permission: 'update_own_users',
        },
      }),
      permissionRepository.findOne({
        where: {
          permission: 'update_own_routes',
        },
      }),
    ]);
    const user_role = roleData.find((role) => role.role === 'user');
    user_role.permission = [
      read_routes,
      read_own_users,
      create_routes,
      delete_own_users,
      delete_own_routes,
      update_own_users,
      update_own_routes,
    ];
    const admin_role = roleData.find((role) => role.role === 'admin');
    admin_role.permission = [
      read_routes,
      read_users,
      create_users,
      create_routes,
      delete_users,
      delete_routes,
      update_users,
      update_routes,
    ];
    await roleRepository.save({
      ...user_role,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await roleRepository.save({
      ...admin_role,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
