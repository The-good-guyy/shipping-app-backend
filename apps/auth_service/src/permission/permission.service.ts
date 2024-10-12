import { Injectable, NotFoundException } from '@nestjs/common';
import { getChangedFields, stringToEnum } from '../common/helpers';
import {
  CreatePermissionDto,
  SearchPermissionOffsetDto,
  UdpatePermissionDto,
} from './dto';
import { PermissionRepository } from './permission.repository';
import {
  EErrorMessage,
  PermissionFieldSearch,
  PermissionOrderBySearch,
  SortOrder,
} from '../common/constants';
import { Permission } from './entities/permission.entity';
import { SortPermissionDto } from './dto/permissionSort.dto';
import { SearchPermissionsFilterDto } from './dto/searchPermissionFilter.dto';
@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}
  async create(CreatePermissionDto: CreatePermissionDto) {
    const newPermission =
      await this.permissionRepository.create(CreatePermissionDto);
    return newPermission;
  }
  async remove(permissionId: string) {
    await this.permissionRepository.findByCode(permissionId);
    await this.permissionRepository.remove(permissionId);
  }
  async findById(permissionId: string) {
    const permission = await this.permissionRepository.findByCode(permissionId);
    return permission;
  }
  async findByName(permissionName: string) {
    const permission =
      await this.permissionRepository.findByName(permissionName);
    return permission;
  }
  async update(input: UdpatePermissionDto) {
    const existingEntity = await this.permissionRepository.findByCode(input.id);
    if (!existingEntity) {
      throw new NotFoundException(EErrorMessage.ENTITY_NOT_FOUND);
    }
    const updatedData = getChangedFields<UdpatePermissionDto>(
      existingEntity,
      input,
    );
    return await this.permissionRepository.update(existingEntity, updatedData);
  }
  async search(
    offset: SearchPermissionOffsetDto,
    filters: object,
    fields: string[],
    sort: { orderBy: string; order: string }[],
    search: string,
  ) {
    const permissionCols = this.permissionRepository.getColsPermission();
    console.log(permissionCols);
    let permissionFields = fields.filter(
      (field) =>
        permissionCols.includes(field as keyof Permission) &&
        stringToEnum(PermissionFieldSearch, field),
    ) as (keyof Permission)[];
    permissionFields =
      permissionFields.length > 0 ? permissionFields : permissionCols;
    let sortObj: SortPermissionDto[] = [];
    if (!Array.isArray(sort) || !sort.length) {
      sortObj = [new SortPermissionDto()];
    } else {
      for (const obj of sort) {
        const { orderBy, order } = obj;
        if (stringToEnum(PermissionOrderBySearch, orderBy)) {
          sortObj.push({
            orderBy: stringToEnum(PermissionOrderBySearch, orderBy),
            order: stringToEnum(SortOrder, order) || SortOrder.desc,
          });
        }
      }
    }
    sortObj = sortObj.length > 0 ? sortObj : [new SortPermissionDto()];
    const filtersObject = new SearchPermissionsFilterDto();
    for (const k in filters) {
      if (stringToEnum(PermissionFieldSearch, k)) {
        filtersObject[k] = filters[k];
      }
    }
    return await this.permissionRepository.search(
      offset,
      filtersObject,
      permissionFields,
      sortObj,
      search,
    );
  }
}
