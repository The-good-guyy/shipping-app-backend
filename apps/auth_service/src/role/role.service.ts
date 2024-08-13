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
    permission.forEach(async (p) => {
      permissions.push(await this.permissionService.findById(p.id));
    });
    return await this.roleRepository.create({
      ...createRoleDto,
      permission: permissions,
    });
  }
  // async create(
  //   createRoleDto: createRoleDto,
  //   permissionsCode: string[],
  // ): Promise<Role>;
  // async create(
  //   createRoleDto: createRoleDto,
  //   permissionsCode: number[],
  // ): Promise<Role>;
  // async create(
  //   createRoleDto: createRoleDto,
  //   permissionsCode: Permission[],
  // ): Promise<Role>;

  // async create(
  //   createRoleDto: createRoleDto,
  //   permissionsCode: string[] | number[] | Permission[],
  // ): Promise<Role> {
  //   if (permissionsCode === undefined || permissionsCode.length === 0) {
  //     return await this.roleRepository.create({
  //       ...createRoleDto,
  //     });
  //   }
  //   const permissions: Permission[] = [];
  //   if (typeof permissionsCode[0] === 'number') {
  //     permissionsCode.forEach(async (code) => {
  //       const permission = await this.permissionService.findById(
  //         code as string,
  //       );
  //       permissions.push(permission);
  //     });
  //   } else if (typeof permissionsCode[0] === 'string') {
  //     permissionsCode.forEach(async (code) => {
  //       const permission = await this.permissionService.findByName(code);
  //       permissions.push(permission);
  //     });
  //   } else {
  //     permissionsCode.forEach(async (permission) => {
  //       const newPermission = await this.permissionService.findById(
  //         permission.id,
  //       );
  //       permissions.push(newPermission);
  //     });
  //   }
  //   return this.roleRepository.create({
  //     ...createRoleDto,
  //     permission: permissions,
  //   });
  // }
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
    permission.forEach(async (p) => {
      permissions.push(await this.permissionService.findById(p.id));
    });
    return await this.roleRepository.update({
      ...updateRoleDto,
      permission: permissions,
    });
  }

  //Will use generic in the future
  async updatePermission(
    roleId: string,
    permissionsCode: string[],
  ): Promise<Role>;
  async updatePermission(
    roleId: string,
    permissionsCode: number[],
  ): Promise<Role>;

  async updatePermission(
    roleId: string,
    permissionsCode: string[] | number[],
  ): Promise<Role> {
    if (permissionsCode === undefined || permissionsCode.length === 0) {
      throw new NotAcceptableException(
        EErrorMessage.SOME_PERMISSIONS_NOT_FOUND,
      );
    }
    const role = await this.roleRepository.findByCode(roleId);
    const permissions: Permission[] = [];
    if (typeof permissionsCode[0] === 'number') {
      permissionsCode.forEach(async (code) => {
        const permission = await this.permissionService.findById(
          code as string,
        );
        permissions.push(permission);
      });
    } else {
      permissionsCode.forEach(async (code) => {
        const permission = await this.permissionService.findByName(code);
        permissions.push(permission);
      });
    }
    return this.roleRepository.updatePermissionOnRole(role, permissions);
  }
}
