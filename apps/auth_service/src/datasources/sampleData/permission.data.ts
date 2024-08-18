import { PermissionInterface } from '../../permission/entities/permission.interface';
import { PermissionAction } from '../../common/constants';
import { PermissionObject } from '../../common/constants';
export const permissionData: Array<
  Pick<PermissionInterface, 'permission' | 'action' | 'object'>
> = [
  {
    permission: 'read_user',
    action: PermissionAction.READ,
    object: PermissionObject.USER,
  },
  {
    permission: 'read_routes',
    action: PermissionAction.READ,
    object: PermissionObject.ROUTE,
  },
  {
    permission: 'create_user',
    action: PermissionAction.CREATE,
    object: PermissionObject.USER,
  },
  {
    permission: 'create_routes',
    action: PermissionAction.CREATE,
    object: PermissionObject.ROUTE,
  },
  {
    permission: 'delete_user',
    action: PermissionAction.DELETE,
    object: PermissionObject.USER,
  },
  {
    permission: 'delete_routes',
    action: PermissionAction.DELETE,
    object: PermissionObject.ROUTE,
  },
  {
    permission: 'update_user',
    action: PermissionAction.UPDATE,
    object: PermissionObject.USER,
  },
  {
    permission: 'update_routes',
    action: PermissionAction.UPDATE,
    object: PermissionObject.ROUTE,
  },
  {
    permission: 'manage_user',
    action: PermissionAction.MANAGE,
    object: PermissionObject.USER,
  },
  {
    permission: 'manage_routes',
    action: PermissionAction.MANAGE,
    object: PermissionObject.ROUTE,
  },
];
