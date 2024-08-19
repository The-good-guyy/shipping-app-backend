import { PermissionInterface } from '../../permission/entities/permission.interface';
import { PermissionAction } from '../../common/constants';
import { PermissionObject } from '../../common/constants';
export const permissionData: Array<
  Pick<
    PermissionInterface,
    'permission' | 'action' | 'object' | 'createdAt' | 'updatedAt'
  >
> = [
  {
    permission: 'read_users',
    action: PermissionAction.READ,
    object: PermissionObject.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    permission: 'read_routes',
    action: PermissionAction.READ,
    object: PermissionObject.ROUTE,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    permission: 'create_users',
    action: PermissionAction.CREATE,
    object: PermissionObject.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    permission: 'create_routes',
    action: PermissionAction.CREATE,
    object: PermissionObject.ROUTE,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    permission: 'delete_users',
    action: PermissionAction.DELETE,
    object: PermissionObject.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    permission: 'delete_routes',
    action: PermissionAction.DELETE,
    object: PermissionObject.ROUTE,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    permission: 'update_users',
    action: PermissionAction.UPDATE,
    object: PermissionObject.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    permission: 'update_routes',
    action: PermissionAction.UPDATE,
    object: PermissionObject.ROUTE,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    permission: 'manage_users',
    action: PermissionAction.MANAGE,
    object: PermissionObject.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    permission: 'manage_routes',
    action: PermissionAction.MANAGE,
    object: PermissionObject.ROUTE,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
