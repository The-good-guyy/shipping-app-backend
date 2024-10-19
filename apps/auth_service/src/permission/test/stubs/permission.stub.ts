import { PermissionInterface } from '../../entities/permission.interface';
import {
  PermissionAction,
  PermissionObject,
  PermissionPossession,
} from 'libs/common/constants';
export const permissionStub = (): PermissionInterface => {
  return {
    id: '0f7427fd-3d6b-4f89-abae-2542855f2d30',
    permission: 'permission',
    action: PermissionAction.CREATE,
    object: PermissionObject.PERMISSION,
    possession: PermissionPossession.ANY,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
