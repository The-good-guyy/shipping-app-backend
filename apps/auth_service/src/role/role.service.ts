import { Injectable, NotAcceptableException } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { createRoleDto } from './dto';
import { Permission } from '../permission/entities/permission.entity';
import { Role } from './entities/role.entity';
import { PermissionService } from '../permission/permission.service';
import { EErrorMessage } from '../common/constraints';
import { updateRoleDto } from './dto';
@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly permissionService: PermissionService,
  ) {}
  async create(createRoleDto: createRoleDto) {
    const permission = createRoleDto.permission;
    const permissions: Permission[] = [];
    for await (const p of permission) {
      const searchPermission = await this.permissionService.findById(p.id);
      permissions.push(searchPermission);
    }
    return await this.roleRepository.create({
      ...createRoleDto,
      permission: permissions,
    });
  }
  async remove(roleId: string) {
    await this.roleRepository.findByCode(roleId);
    await this.roleRepository.remove(roleId);
  }
  async findById(roleId: string) {
    const role = await this.roleRepository.findByCode(roleId);
    return role;
  }
  async findByName(roleName: string) {
    const role = await this.roleRepository.findByName(roleName);
    return role;
  }
  async update(updateRoleDto: updateRoleDto) {
    await this.roleRepository.findByCode(updateRoleDto.id);
    const permission = updateRoleDto.permission;
    const permissions: Permission[] = [];
    for await (const p of permission) {
      const searchPermission = await this.permissionService.findById(p.id);
      permissions.push(searchPermission);
    }
    return await this.roleRepository.update({
      ...updateRoleDto,
      permission: permissions,
    });
    // return await this.roleRepository.findByCode(updateRoleDto.id);
  }
  // async updatePermission(
  //   roleId: string,
  //   permissionsCode: string[],
  // ): Promise<Role>;
  // async updatePermission(
  //   roleId: string,
  //   permissionsCode: number[],
  // ): Promise<Role>;

  // async updatePermission(
  //   roleId: string,
  //   permissionsCode: string[] | number[],
  // ): Promise<Role> {
  //   if (permissionsCode === undefined || permissionsCode.length === 0) {
  //     throw new NotAcceptableException(
  //       EErrorMessage.SOME_PERMISSIONS_NOT_FOUND,
  //     );
  //   }
  //   const role = await this.roleRepository.findByCode(roleId);
  //   const permissions: Permission[] = [];
  //   if (typeof permissionsCode[0] === 'number') {
  //     permissionsCode.forEach(async (code) => {
  //       const permission = await this.permissionService.findById(
  //         code as string,
  //       );
  //       permissions.push(permission);
  //     });
  //   } else {
  //     permissionsCode.forEach(async (code) => {
  //       const permission = await this.permissionService.findByName(code);
  //       permissions.push(permission);
  //     });
  //   }
  //   return this.roleRepository.updatePermissionOnRole(role, permissions);
  // }

  async updatePermission(
    roleId: string,
    permissionsCode: string[],
  ): Promise<Role> {
    if (permissionsCode === undefined || permissionsCode.length === 0) {
      throw new NotAcceptableException(
        EErrorMessage.SOME_PERMISSIONS_NOT_FOUND,
      );
    }
    const role = await this.roleRepository.findByCode(roleId);
    const permissions: Permission[] = [];
    permissionsCode.forEach(async (code) => {
      const permission = await this.permissionService.findById(code);
      permissions.push(permission);
    });
    return this.roleRepository.updatePermissionOnRole(role, permissions);
  }
}
