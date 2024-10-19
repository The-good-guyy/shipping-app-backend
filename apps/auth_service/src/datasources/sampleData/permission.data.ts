import { PermissionInterface } from '../../permission/entities/permission.interface';
import {
  PermissionAction,
  PermissionPossession,
  PermissionObject,
} from 'libs/common/constants';
export const oldPermissionData: Array<
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
export const permissionData: Array<
  Pick<
    PermissionInterface,
    | 'permission'
    | 'action'
    | 'object'
    | 'createdAt'
    | 'updatedAt'
    | 'possession'
  >
> = [
  {
    permission: 'read_users',
    action: PermissionAction.READ,
    object: PermissionObject.USER,
    possession: PermissionPossession.ANY,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    permission: 'read_routes',
    action: PermissionAction.READ,
    object: PermissionObject.ROUTE,
    possession: PermissionPossession.ANY,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    permission: 'create_routes',
    action: PermissionAction.CREATE,
    object: PermissionObject.ROUTE,
    possession: PermissionPossession.ANY,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    permission: 'delete_users',
    action: PermissionAction.DELETE,
    object: PermissionObject.USER,
    possession: PermissionPossession.ANY,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    permission: 'delete_routes',
    action: PermissionAction.DELETE,
    object: PermissionObject.ROUTE,
    possession: PermissionPossession.ANY,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    permission: 'update_profiles',
    action: PermissionAction.UPDATE,
    object: PermissionObject.PROFILE,
    possession: PermissionPossession.ANY,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    permission: 'update_users',
    action: PermissionAction.UPDATE,
    object: PermissionObject.USER,
    possession: PermissionPossession.ANY,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    permission: 'search_users',
    action: PermissionAction.SEARCH,
    object: PermissionObject.USER,
    possession: PermissionPossession.ANY,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    permission: 'search_routes',
    action: PermissionAction.SEARCH,
    object: PermissionObject.ROUTE,
    possession: PermissionPossession.ANY,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    permission: 'search_roles',
    action: PermissionAction.SEARCH,
    object: PermissionObject.ROLE,
    possession: PermissionPossession.ANY,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    permission: 'search_permissions',
    action: PermissionAction.SEARCH,
    object: PermissionObject.PERMISSION,
    possession: PermissionPossession.ANY,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    permission: 'update_routes',
    action: PermissionAction.UPDATE,
    object: PermissionObject.ROUTE,
    possession: PermissionPossession.ANY,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    permission: 'read_own_users',
    action: PermissionAction.READ,
    object: PermissionObject.USER,
    possession: PermissionPossession.OWN,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    permission: 'update_own_profiles',
    action: PermissionAction.UPDATE,
    object: PermissionObject.PROFILE,
    possession: PermissionPossession.OWN,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    permission: 'delete_own_users',
    action: PermissionAction.DELETE,
    object: PermissionObject.USER,
    possession: PermissionPossession.OWN,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    permission: 'read_own_routes',
    action: PermissionAction.READ,
    object: PermissionObject.ROUTE,
    possession: PermissionPossession.OWN,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    permission: 'update_own_routes',
    action: PermissionAction.UPDATE,
    object: PermissionObject.ROUTE,
    possession: PermissionPossession.OWN,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    permission: 'delete_own_routes',
    action: PermissionAction.DELETE,
    object: PermissionObject.ROUTE,
    possession: PermissionPossession.OWN,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    permission: 'read_roles',
    action: PermissionAction.READ,
    object: PermissionObject.ROLE,
    possession: PermissionPossession.ANY,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    permission: 'create_roles',
    action: PermissionAction.CREATE,
    object: PermissionObject.ROLE,
    possession: PermissionPossession.ANY,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    permission: 'update_roles',
    action: PermissionAction.UPDATE,
    object: PermissionObject.ROLE,
    possession: PermissionPossession.ANY,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    permission: 'delete_roles',
    action: PermissionAction.DELETE,
    object: PermissionObject.ROLE,
    possession: PermissionPossession.ANY,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    permission: 'read_permissions',
    action: PermissionAction.READ,
    object: PermissionObject.PERMISSION,
    possession: PermissionPossession.ANY,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    permission: 'create_permissions',
    action: PermissionAction.CREATE,
    object: PermissionObject.PERMISSION,
    possession: PermissionPossession.ANY,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    permission: 'update_permissions',
    action: PermissionAction.UPDATE,
    object: PermissionObject.PERMISSION,
    possession: PermissionPossession.ANY,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    permission: 'delete_permissions',
    action: PermissionAction.DELETE,
    object: PermissionObject.PERMISSION,
    possession: PermissionPossession.ANY,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
