import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionAction, PermissionObject } from '../constants';
import { PERMISSIONS_KEY } from 'libs/common/decorators/permission.decorator';
import { POSSESSION_KEY } from 'libs/common/decorators/possession.decorator';
import { deepGet } from 'libs/common/helpers';
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<
      { action: PermissionAction; object: PermissionObject }[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
    const possession = this.reflector.getAllAndOverride<string>(
      POSSESSION_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermissions) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    const funcPossession = possession
      ? deepGet(context.switchToHttp().getRequest(), possession)
      : undefined;
    return requiredPermissions.some((permission) => {
      for (const userPermission of user.permissions) {
        if (
          userPermission.action === permission.action &&
          userPermission.object === permission.object &&
          (!possession ||
            userPermission.possession === 'any' ||
            (userPermission.possession === 'own' &&
              user.sub === funcPossession))
        ) {
          return true;
        }
      }
    });
  }
}
