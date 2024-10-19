import {
  PermissionAction,
  PermissionObject,
  PermissionPossession,
} from 'libs/common/constants';
export interface PermissionInterface {
  id: string;
  permission: string;
  action: PermissionAction;
  object: PermissionObject;
  possession: PermissionPossession;
  createdAt: Date;
  updatedAt: Date;
}
