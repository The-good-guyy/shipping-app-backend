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
