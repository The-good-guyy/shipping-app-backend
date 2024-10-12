import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  AtGuard,
  PermissionsGuard,
  VerifiedGuard,
  AtCookieGuard,
} from '../common/guard';
import { PermissionService } from './permission.service';
import {
  CreatePermissionDto,
  UdpatePermissionDto,
  SearchPermissionsDto,
  SearchPermissionOffsetDto,
} from './dto';
import { Permissions } from '../common/decorators';
import { PermissionAction, PermissionObject } from '../common/constants';
import { OffsetPaginationDto, OffsetPaginationOptionDto } from '../common/dto';
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}
  @UseGuards(AtGuard, VerifiedGuard, PermissionsGuard)
  @Permissions({
    action: PermissionAction.CREATE,
    object: PermissionObject.PERMISSION,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPermission(@Body() CreatePermissionDto: CreatePermissionDto) {
    return this.permissionService.create(CreatePermissionDto);
  }

  @UseGuards(AtCookieGuard, VerifiedGuard, PermissionsGuard)
  @Permissions({
    action: PermissionAction.READ,
    object: PermissionObject.PERMISSION,
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOneById(@Param('id') id: string) {
    return this.permissionService.findById(id);
  }

  // @UseGuards(AtCookieGuard, VerifiedGuard, PermissionsGuard)
  // @Permissions({
  //   action: PermissionAction.READ,
  //   object: PermissionObject.PERMISSION,
  // })
  // @Get()
  // @HttpCode(HttpStatus.OK)
  // async findOneByName(@Body() findByNameDto: { name: string }) {
  //   return this.permissionService.findByName(findByNameDto.name);
  // }

  @UseGuards(AtGuard, VerifiedGuard, PermissionsGuard)
  @Permissions({
    action: PermissionAction.UPDATE,
    object: PermissionObject.PERMISSION,
  })
  @Patch()
  @HttpCode(HttpStatus.OK)
  async update(@Body() UdpatePermissionDto: UdpatePermissionDto) {
    return this.permissionService.update(UdpatePermissionDto);
  }

  @UseGuards(AtGuard, VerifiedGuard, PermissionsGuard)
  @Permissions({
    action: PermissionAction.DELETE,
    object: PermissionObject.PERMISSION,
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.permissionService.remove(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: SearchPermissionsDto) {
    const filterQuery = { ...query };
    const excludedFields = [
      'page',
      'sort',
      'limit',
      'fields',
      'searchTerm',
      'password',
      'skip',
    ];
    excludedFields.forEach((el) => delete filterQuery[el]);
    const sortQuery: { orderBy: string; order: string }[] = [];
    if (query.sort) {
      const sortObj = query.sort.split(',');
      for (const obj of sortObj) {
        const [orderBy, order] = obj.split(':');
        sortQuery.push({
          orderBy,
          order: order ? order.toUpperCase() : order,
        });
      }
    }
    let fieldsQuery: string[] = [];
    if (query.fields) {
      fieldsQuery = query.fields.split(',');
    }
    const offset = new OffsetPaginationDto();
    offset.pageNumber = query.page || offset.pageNumber;
    offset.limit = query.limit || offset.limit;
    offset.skip = query.skip || undefined;
    const options = new OffsetPaginationOptionDto();
    options.isGetAll = query.getAll || undefined;
    const searchOffset = new SearchPermissionOffsetDto();
    searchOffset.pagination = offset;
    searchOffset.options = options;
    return await this.permissionService.search(
      searchOffset,
      filterQuery,
      fieldsQuery,
      sortQuery,
      query.searchTerm,
    );
  }
}
