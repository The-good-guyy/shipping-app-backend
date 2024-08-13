import { PermissionAction, PermissionObject } from '../../common/constraints';
export interface PermissionIntefrace {
  id: string;
  permission: string;
  action: PermissionAction;
  object: PermissionObject;
  createdAt: Date;
  updatedAt: Date;
}
