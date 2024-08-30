import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionAction, PermissionObject } from '../constants';
import { PERMISSIONS_KEY } from '../decorators/permission.decorator';
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<
      { action: PermissionAction; object: PermissionObject }[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
    if (!requiredPermissions) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return requiredPermissions.some((permission) => {
      for (const userPermission of user.permissions) {
        if (
          (userPermission.action === permission.action &&
            userPermission.object === permission.object) ||
          (userPermission.action === PermissionAction.MANAGE &&
            userPermission.object === permission.object)
        )
          return true;
      }
    });
  }
}
