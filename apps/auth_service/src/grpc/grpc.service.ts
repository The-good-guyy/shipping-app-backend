import { Injectable } from '@nestjs/common';
import { permission, role, user, GetUserRequest } from '@app/common';
import { UserService } from '../users/users.service';
import { Permission } from '../permission/entities/permission.entity';
import { Role } from '../role/entities/role.entity';
import { NotFoundException } from '@nestjs/common';
import { EErrorMessage } from 'libs/common/error';

@Injectable()
export class UsersGrpcService {
  constructor(private readonly userService: UserService) {}
  getUserPermissions(EntityPermission: Permission[]) {
    const permissions: permission[] = [];
    for (const p of EntityPermission) {
      const permission: permission = {
        id: p.id,
        permission: p.permission,
        action: p.action,
        object: p.object,
        possession: p.possession,
        createdAt: {
          seconds: Math.floor(p.createdAt.getTime() / 1000),
          nanos: (p.createdAt.getTime() % 1000) * 1e6,
        },
        updatedAt: {
          seconds: Math.floor(p.updatedAt.getTime() / 1000),
          nanos: (p.updatedAt.getTime() % 1000) * 1e6,
        },
      };
      permissions.push(permission);
    }
    return permissions;
  }
  getUserRoles(EntityRole: Role) {
    const permissions: permission[] = this.getUserPermissions(
      EntityRole.permission,
    );
    const role: role = {
      id: EntityRole.id,
      role: EntityRole.role,
      permissions: permissions,
      createdAt: {
        seconds: Math.floor(EntityRole.createdAt.getTime() / 1000),
        nanos: (EntityRole.createdAt.getTime() % 1000) * 1e6,
      },
      updatedAt: {
        seconds: Math.floor(EntityRole.updatedAt.getTime() / 1000),
        nanos: (EntityRole.updatedAt.getTime() % 1000) * 1e6,
      },
    };
    return role;
  }
  async getUser(request: GetUserRequest) {
    const res = await this.userService.findById(request.id);
    if (!res) {
      throw new NotFoundException(EErrorMessage.USER_NOT_FOUND);
    }
    const newRole = this.getUserRoles(res.role);
    const user: user = {
      id: res.id,
      username: res.username,
      email: res.email,
      profileImage: res.profileImage,
      isVerified: res.isVerified,
      role: newRole,
      createdAt: {
        seconds: Math.floor(res.createdAt.getTime() / 1000),
        nanos: (res.createdAt.getTime() % 1000) * 1e6,
      },
      updatedAt: {
        seconds: Math.floor(res.updatedAt.getTime() / 1000),
        nanos: (res.updatedAt.getTime() % 1000) * 1e6,
      },
    };
    return user;
  }
}
