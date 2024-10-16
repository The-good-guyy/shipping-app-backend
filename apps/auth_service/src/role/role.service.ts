import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { CreateRoleDto, SearchRoleFilterDto, SortRoleDto } from './dto';
import { Permission } from '../permission/entities/permission.entity';
import { Role } from './entities/role.entity';
import { PermissionService } from '../permission/permission.service';
import { EErrorMessage } from '../common/constants';
import { UpdateRoleDto } from './dto';
import { SearchOffsetPaginationDto } from '../common/dto';
import { stringToEnum } from '../common/helpers';
import {
  SortOrder,
  RoleOrderBySearch,
  RoleFieldSearch,
  RoleFilterSearch,
} from '../common/constants';
@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly permissionService: PermissionService,
  ) {}
  async create(CreateRoleDto: CreateRoleDto) {
    const permission = CreateRoleDto.permissionId;
    const permissions: Permission[] = [];
    for await (const p of permission) {
      const searchPermission = await this.permissionService.findById(p);
      if (!searchPermission) {
        throw new NotFoundException(EErrorMessage.SOME_PERMISSIONS_NOT_FOUND);
      }
      permissions.push(searchPermission);
    }
    return await this.roleRepository.create({
      ...CreateRoleDto,
      permission: permissions,
    });
  }
  async update(role: UpdateRoleDto) {
    const permission = role.permissionId;
    const permissions: Permission[] = [];
    for await (const p of permission) {
      const searchPermission = await this.permissionService.findById(p);
      if (!searchPermission) {
        throw new NotFoundException(EErrorMessage.SOME_PERMISSIONS_NOT_FOUND);
      }
      permissions.push(searchPermission);
    }
    return await this.roleRepository.update(role, permissions);
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
      throw new NotFoundException(EErrorMessage.SOME_PERMISSIONS_NOT_FOUND);
    }
    const role = await this.roleRepository.findByCode(roleId);
    if (!role) {
      throw new NotFoundException(EErrorMessage.ENTITY_NOT_FOUND);
    }
    const permissions: Permission[] = [];
    for await (const p of permissionsCode) {
      const searchPermission = await this.permissionService.findById(p);
      if (!searchPermission) {
        throw new NotFoundException(EErrorMessage.SOME_PERMISSIONS_NOT_FOUND);
      }
      permissions.push(searchPermission);
    }
    return this.roleRepository.updatePermissionOnRole(role, permissions);
  }
  async search(
    offset: SearchOffsetPaginationDto,
    filters: object,
    fields: string[],
    sort: { orderBy: string; order: string }[],
    search: string,
  ) {
    const roleCols = this.roleRepository.getColsRole();
    let userFields = fields.filter(
      (field) =>
        roleCols.includes(field as keyof Role) &&
        stringToEnum(RoleFieldSearch, field),
    ) as (keyof Role)[];
    userFields =
      userFields.length > 0 ? userFields : (roleCols as (keyof Role)[]);
    let sortObj: SortRoleDto[] = [];
    if (!Array.isArray(sort) || !sort.length) {
      sortObj = [new SortRoleDto()];
    } else {
      for (const obj of sort) {
        const { orderBy, order } = obj;
        if (stringToEnum(RoleOrderBySearch, orderBy)) {
          sortObj.push({
            orderBy: stringToEnum(RoleOrderBySearch, orderBy),
            order: stringToEnum(SortOrder, order) || SortOrder.desc,
          });
        }
      }
    }
    sortObj = sortObj.length > 0 ? sortObj : [new SortRoleDto()];
    const filtersObject = new SearchRoleFilterDto();
    for (const k in filters) {
      if (stringToEnum(RoleFilterSearch, k)) {
        filtersObject[k] = filters[k];
      }
    }
    return await this.roleRepository.search(
      offset,
      filtersObject,
      userFields,
      sortObj,
      search,
    );
  }
}
