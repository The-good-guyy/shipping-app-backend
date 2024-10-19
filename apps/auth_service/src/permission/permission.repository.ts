import { Injectable, NotFoundException } from '@nestjs/common';
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
import { filterHandle, sortHandle } from '../common/helper';
import { Like, Not, In, Repository } from 'typeorm';
import { SearchOffsetPaginationDto } from '../common/dto';
@Injectable()
export class PermissionRepository {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
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
    const newFilters = filterHandle(filters);
    const sortOrder = sortHandle(sort);
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
