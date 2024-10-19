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
  PermissionsGuard,
  VerifiedGuard,
  AtCookieGuard,
} from 'libs/common/guard';
import { PermissionService } from './permission.service';
import {
  CreatePermissionDto,
  UdpatePermissionDto,
  SearchPermissionsDto,
  SearchExcludePermissionsDto,
} from './dto';
import { Permissions } from 'libs/common/decorators';
import { PermissionAction, PermissionObject } from 'libs/common/constants';
import { queryHandle } from '../common/helper/queryHandle.helper';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}
  @UseGuards(AtCookieGuard, VerifiedGuard, PermissionsGuard)
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

  @UseGuards(AtCookieGuard, VerifiedGuard, PermissionsGuard)
  @Permissions({
    action: PermissionAction.UPDATE,
    object: PermissionObject.PERMISSION,
  })
  @Patch()
  @HttpCode(HttpStatus.OK)
  async update(@Body() UdpatePermissionDto: UdpatePermissionDto) {
    return this.permissionService.update(UdpatePermissionDto);
  }

  @UseGuards(AtCookieGuard, VerifiedGuard, PermissionsGuard)
  @Permissions({
    action: PermissionAction.DELETE,
    object: PermissionObject.PERMISSION,
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.permissionService.remove(id);
  }

  @UseGuards(AtCookieGuard, VerifiedGuard, PermissionsGuard)
  @Permissions({
    action: PermissionAction.SEARCH,
    object: PermissionObject.PERMISSION,
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: SearchPermissionsDto,
    @Body() body: SearchExcludePermissionsDto,
  ) {
    const { searchOffset, filterQuery, fieldsQuery, sortQuery } =
      queryHandle(query);
    return await this.permissionService.search(
      searchOffset,
      filterQuery,
      fieldsQuery,
      sortQuery,
      query.searchTerm,
      body,
    );
  }
}
