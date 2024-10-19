import { SetMetadata } from '@nestjs/common';
import { PermissionObject } from '../constants';
import { PermissionAction } from '../constants';
export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (
  ...Permissions: { action: PermissionAction; object: PermissionObject }[]
) => SetMetadata(PERMISSIONS_KEY, Permissions);
