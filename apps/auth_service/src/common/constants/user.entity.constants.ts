export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  UNVERIFIED = 'unverified',
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
  NONE = 'none',
}
export enum UserOrderBySearch {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  ROLE = 'role',
  ROLE_ID = 'role.id',
  ROLE_ROLE = 'role.role',
}
export enum UserFilterSearch {
  ID = 'id',
  USERNAME = 'username',
  EMAIL = 'email',
  IS_VERIFIED = 'isVerified',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
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
