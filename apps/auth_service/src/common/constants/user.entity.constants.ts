export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  UNVERIFIED = 'unverified',
  SYSADMIN = 'sysadmin',
}
export enum PermissionAction {
  READ = 'read',
  CREATE = 'create',
  DELETE = 'delete',
  UPDATE = 'update',
  MANAGE = 'manage',
  NONE = 'none',
}
export enum PermissionObject {
  USER = 'user',
  ROUTE = 'route',
  ROLE = 'role',
  PERMISSION = 'permission',
  NONE = 'none',
}
export enum UserOrderBySearch {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  ROLE_ID = 'role.id',
  ROLE_ROLE = 'role.role',
  ROLE_PERMISSION_ID = 'role.permission.id',
  ROLE_PERMISSION_PERMISSION = 'role.permission.permission',
  ROLE_PERMISSION_ACTION = 'role.permission.action',
  ROLE_PERMISSION_OBJECT = 'role.permission.object',
  ROLE_PERMISSION_POSSESSION = 'role.permission.possession',
}
export enum UserFilterSearch {
  ID = 'id',
  USERNAME = 'username',
  EMAIL = 'email',
  IS_VERIFIED = 'isVerified',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  ROLE_ID = 'role_id',
  ROLE_ROLE = 'role_role',
  ROLE_PERMISSION_ID = 'role_permission_id',
  ROLE_PERMISSION_PERMISSION = 'role_permission_permission',
  ROLE_PERMISSION_ACTION = 'role_permission_action',
  ROLE_PERMISSION_OBJECT = 'role_permission_object',
  ROLE_PERMISSION_POSSESSION = 'role_permission_possession',
}
export enum UserFieldSearch {
  ID = 'id',
  USERNAME = 'username',
  EMAIL = 'email',
  IS_VERIFIED = 'isVerified',
  ROLE = 'role',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}
export enum PermissionPossession {
  ANY = 'any',
  OWN = 'own',
  GROUP = 'group',
}
