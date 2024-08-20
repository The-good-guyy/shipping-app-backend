import { PermissionAction, PermissionObject } from '../../common/constants';
export interface PermissionInterface {
  id: string;
  permission: string;
  action: PermissionAction;
  object: PermissionObject;
  createdAt: Date;
  updatedAt: Date;
}
