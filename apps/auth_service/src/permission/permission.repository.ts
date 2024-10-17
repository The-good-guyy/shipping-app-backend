import { Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import {
  CreatePermissionDto,
  UdpatePermissionDto,
  SearchExcludePermissionsDto,
  SortPermissionDto,
  SearchPermissionsFilterDto,
} from './dto';
import { EErrorMessage } from 'libs/common/error';
import { getCols } from 'libs/common/helpers';
import {
  MoreThan,
  LessThan,
  LessThanOrEqual,
  MoreThanOrEqual,
  ILike,
  Like,
  Not,
} from 'typeorm';
import { SearchOffsetPaginationDto } from '../common/dto';
@Injectable()
export class PermissionRepository {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}
  async create(CreatePermissionDto: CreatePermissionDto) {
    const permission = await this.permissionRepository.findOne({
      where: { permission: CreatePermissionDto.permission },
    });
    if (permission) throw new NotFoundException(EErrorMessage.ENTITY_EXISTED);
    let newPermission = this.permissionRepository.create({
      ...CreatePermissionDto,
    });
    newPermission = await this.permissionRepository.save(newPermission);
    return newPermission;
  }
  async remove(permissionId: string): Promise<void> {
    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId },
    });
    if (permission) this.permissionRepository.delete(permission);
  }
  // async update(permissionId: string, input: Partial<UdpatePermissionDto>) {
  //   return await this.permissionRepository.update(permissionId, {
  //     ...input,
  //     updatedAt: new Date(),
  //   });
  // }
  async update(permission: Permission, input: Partial<UdpatePermissionDto>) {
    if (input.id) {
      delete input['id'];
    }
    const updatedPermission = this.permissionRepository.create({
      ...permission,
      ...input,
    });
    return await this.permissionRepository.save(updatedPermission);
  }
  async findByCode(permissionId: string) {
    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId },
    });
    return permission;
  }
  async findByName(permissionName: string) {
    const permisson = await this.permissionRepository.findOne({
      where: { permission: permissionName },
    });
    return permisson;
  }
  getColsPermission() {
    const fields = getCols(this.permissionRepository);
    return fields;
  }
  async search(
    offset: SearchOffsetPaginationDto,
    filters: SearchPermissionsFilterDto,
    fields: (keyof Permission)[],
    sort: SortPermissionDto[],
    search: string,
    body: SearchExcludePermissionsDto,
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
    newFilters['id'] = body.exclude
      ? Not(In(body.exclude))
      : newFilters['id'] || undefined;
    const newFilterGroup = search
      ? { permission: Like(`%${search.toLowerCase()}%`), ...newFilters }
      : newFilters;
    if (isGetAll) {
      const entities = await this.permissionRepository.find({
        select: fields,
        where: newFilterGroup ? newFilterGroup : undefined,
        relations: fields.includes('role') ? { role: true } : undefined,
        order: sortOrder ? sortOrder : undefined,
      });
      return {
        totalCount: entities.length,
        permissions: entities,
      };
    }
    const [entities, count] = await this.permissionRepository.findAndCount({
      skip: skip || limit * (pageNumber - 1),
      take: limit,
      select: fields,
      where: newFilterGroup ? newFilterGroup : undefined,
      relations: fields.includes('role') ? { role: true } : undefined,
      order: sortOrder ? sortOrder : undefined,
    });
    return {
      pageNumber,
      pageSize: limit,
      totalCount: count,
      permissions: entities,
    };
  }
}
