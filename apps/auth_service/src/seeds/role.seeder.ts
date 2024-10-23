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
      read_own_users,
      create_routes,
      delete_users,
      delete_own_users,
      delete_routes,
      update_routes,
      read_roles,
      create_roles,
      delete_roles,
      update_roles,
      read_permissions,
      create_permissions,
      delete_permissions,
      update_permissions,
      update_profiles,
      update_users,
      update_own_profiles,
      search_users,
      search_routes,
      search_roles,
      search_permissions,
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
          permission: 'update_routes',
        },
      }),
      permissionRepository.findOne({
        where: {
          permission: 'read_roles',
        },
      }),
      permissionRepository.findOne({
        where: {
          permission: 'create_roles',
        },
      }),
      permissionRepository.findOne({
        where: {
          permission: 'delete_roles',
        },
      }),
      permissionRepository.findOne({
        where: {
          permission: 'update_roles',
        },
      }),
      permissionRepository.findOne({
        where: {
          permission: 'read_permissions',
        },
      }),
      permissionRepository.findOne({
        where: {
          permission: 'create_permissions',
        },
      }),
      permissionRepository.findOne({
        where: {
          permission: 'delete_permissions',
        },
      }),
      permissionRepository.findOne({
        where: {
          permission: 'update_permissions',
        },
      }),
      permissionRepository.findOne({
        where: {
          permission: 'update_profiles',
        },
      }),
      permissionRepository.findOne({
        where: {
          permission: 'update_users',
        },
      }),
      permissionRepository.findOne({
        where: {
          permission: 'update_own_profiles',
        },
      }),
      permissionRepository.findOne({
        where: {
          permission: 'search_users',
        },
      }),
      permissionRepository.findOne({
        where: {
          permission: 'search_routes',
        },
      }),
      permissionRepository.findOne({
        where: {
          permission: 'search_roles',
        },
      }),
      permissionRepository.findOne({
        where: {
          permission: 'search_permissions',
        },
      }),
    ]);
    const user_role = roleData.find((role) => role.role === 'user');
    user_role.permission = [
      read_routes,
      read_own_users,
      create_routes,
      delete_own_users,
      update_own_profiles,
    ];
    const admin_role = roleData.find((role) => role.role === 'admin');
    admin_role.permission = [
      read_routes,
      read_users,
      create_routes,
      delete_users,
      delete_routes,
      update_profiles,
      update_users,
      update_routes,
      search_users,
      search_routes,
      search_roles,
      search_permissions,
    ];
    const sysadmin_role = roleData.find((role) => role.role === 'sysadmin');
    sysadmin_role.permission = [
      read_routes,
      read_users,
      create_routes,
      delete_users,
      delete_routes,
      update_users,
      update_profiles,
      search_users,
      search_routes,
      search_roles,
      search_permissions,
      update_routes,
      read_roles,
      create_roles,
      delete_roles,
      update_roles,
      read_permissions,
      create_permissions,
      delete_permissions,
      update_permissions,
    ];
    await Promise.all([
      roleRepository.save({
        ...user_role,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      roleRepository.save({
        ...admin_role,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      roleRepository.save({
        ...sysadmin_role,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ]);
  }
}
