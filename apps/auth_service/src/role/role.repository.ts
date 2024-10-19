import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { EErrorMessage } from 'libs/common/error';
import { UpdateRoleDto } from './dto';
import { Permission } from '../permission/entities/permission.entity';
import { getCols } from 'libs/common/helpers';
import { SearchOffsetPaginationDto } from '../common/dto';
import {
  MoreThan,
  LessThan,
  LessThanOrEqual,
  MoreThanOrEqual,
  ILike,
  Like,
  Not,
  Repository,
} from 'typeorm';
import { SearchRoleFilterDto, SortRoleDto } from './dto';
@Injectable()
export class RoleRepository {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}
  async create(CreateRoleDto: { role: string; permission: Permission[] }) {
    const role = await this.roleRepository.findOne({
      where: { role: CreateRoleDto.role },
    });
    if (role) throw new NotFoundException(EErrorMessage.ENTITY_EXISTED);
    let newRole = this.roleRepository.create({
      ...CreateRoleDto,
    });
    newRole = await this.roleRepository.save(newRole);
    return newRole;
  }
  async remove(roleId: string): Promise<void> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
    });
    if (role) this.roleRepository.delete(role);
  }
  async update(role: UpdateRoleDto, permissions: Permission[]) {
    const existingRole = await this.roleRepository.findOne({
      where: { id: role.id },
    });
    if (!existingRole) {
      throw new NotFoundException(EErrorMessage.ENTITY_NOT_FOUND);
    }
    const updatedRole = this.roleRepository.create({
      ...existingRole,
      role: role.role || existingRole.role,
      permission: permissions || existingRole.permission,
    });
    return await this.roleRepository.save(updatedRole);
  }
  async updatePermissionOnRole(role: Role, permissions: Permission[]) {
    const updatedRole = this.roleRepository.create({
      ...role,
      permission: permissions,
    });
    return await this.roleRepository.save(updatedRole);
  }
  async findByCode(roleId: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permission'],
    });
    return role;
  }
  async findByName(roleName: string) {
    const role = await this.roleRepository.findOne({
      where: { role: roleName },
      relations: ['permission'],
    });
    return role;
  }
  getColsRole() {
    const fields = getCols(this.roleRepository);
    return [...fields, 'permission'];
  }
  async search(
    offset: SearchOffsetPaginationDto,
    filters: SearchRoleFilterDto,
    fields: (keyof Role)[],
    sort: SortRoleDto[],
    search: string,
  ) {
    const { limit, pageNumber, skip } = offset.pagination;
    const { isGetAll } = offset.options ?? {};
    const newFilters = {};
    for (const key in filters) {
      const value = filters[key];
      if (typeof value === 'object' && value !== null) {
        if (value.gte !== null && value.gte !== undefined) {
          filters[key] = MoreThanOrEqual(value.gte);
        } else if (value.gt !== null && value.gt !== undefined) {
          filters[key] = MoreThan(value.gt);
        } else if (value.lte !== null && value.lte !== undefined)
          filters[key] = LessThanOrEqual(value.lte);
        else if (value.lt !== null && value.lt !== undefined)
          filters[key] = LessThan(value.lt);
        else if (value.ne !== null && value.ne !== undefined)
          filters[key] = Not(value.ne);
        else if (value.il !== null && value.il !== undefined)
          filters[key] = ILike(`%${value.ilike}%`);
        else if (value.like !== null && value.like !== undefined)
          filters[key] = Like(`%${value.like}%`);
      }
      const newValues = filters[key];
      const keyValue = key.split('_');
      let o = newFilters;
      for (let i = 0; i < keyValue.length - 1; i++) {
        const prop = keyValue[i];
        o[prop] = o[prop] || {};
        o = o[prop];
      }
      o[keyValue[keyValue.length - 1]] = newValues;
    }
    const sortOrder = {};
    sort.forEach((obj) => {
      const sortOrderBy = obj.orderBy.split('.');
      let object = sortOrder;
      for (let i = 0; i < sortOrderBy.length - 1; i++) {
        const prop = sortOrderBy[i];
        object[prop] = {};
        object = object[prop];
      }
      object[sortOrderBy[sortOrderBy.length - 1]] = obj.order;
    });
    const newFilterGroup = search
      ? { role: ILike(`%${search}%`), ...newFilters }
      : newFilters;
    if (isGetAll) {
      const entities = await this.roleRepository.find({
        select: fields,
        where: newFilterGroup ? newFilterGroup : undefined,
        relations: fields.includes('permission')
          ? { permission: true }
          : undefined,
        order: sortOrder ? sortOrder : undefined,
      });
      return {
        totalCount: entities.length,
        roles: entities,
      };
    }
    const [entities, count] = await this.roleRepository.findAndCount({
      skip: skip || limit * (pageNumber - 1),
      take: limit,
      select: fields,
      where: newFilterGroup ? newFilterGroup : undefined,
      relations: fields.includes('permission')
        ? { permission: true }
        : undefined,
      order: sortOrder ? sortOrder : undefined,
    });
    return {
      pageNumber,
      pageSize: limit,
      totalCount: count,
      roles: entities,
    };
  }
}
