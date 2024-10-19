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
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto, SearchRoleDto, UpdateRoleDto } from './dto';
import {
  PermissionsGuard,
  VerifiedGuard,
  AtCookieGuard,
} from 'libs/common/guard';
import { PermissionAction, PermissionObject } from 'libs/common/constants';
import { Permissions } from 'libs/common/decorators';
import { NotFoundInterceptor } from '../common/interceptors';
import { queryHandle } from '../common/helper/queryHandle.helper';
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @UseGuards(AtCookieGuard, VerifiedGuard, PermissionsGuard)
  @Permissions({
    action: PermissionAction.CREATE,
    object: PermissionObject.ROLE,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createRole(@Body() CreateRoleDto: CreateRoleDto) {
    return this.roleService.create(CreateRoleDto);
  }

  @UseGuards(AtCookieGuard, VerifiedGuard, PermissionsGuard)
  @Permissions({
    action: PermissionAction.SEARCH,
    object: PermissionObject.ROLE,
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: SearchRoleDto) {
    const { searchOffset, filterQuery, fieldsQuery, sortQuery } =
      queryHandle(query);
    return await this.roleService.search(
      searchOffset,
      filterQuery,
      fieldsQuery,
      sortQuery,
      query.searchTerm,
    );
  }

  @UseGuards(AtCookieGuard, VerifiedGuard, PermissionsGuard)
  @Permissions({
    action: PermissionAction.READ,
    object: PermissionObject.ROLE,
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOneById(@Param('id') id: string) {
    return this.roleService.findById(id);
  }

  @UseGuards(AtCookieGuard, VerifiedGuard, PermissionsGuard)
  @Permissions({
    action: PermissionAction.UPDATE,
    object: PermissionObject.ROLE,
  })
  @Patch()
  @HttpCode(HttpStatus.OK)
  async update(@Body() UpdateRoleDto: UpdateRoleDto) {
    return this.roleService.update(UpdateRoleDto);
  }

  @UseGuards(AtCookieGuard, VerifiedGuard, PermissionsGuard)
  @Permissions({
    action: PermissionAction.UPDATE,
    object: PermissionObject.ROLE,
  })
  @Patch(':id')
  @UseInterceptors(NotFoundInterceptor)
  @HttpCode(HttpStatus.OK)
  async updatePermission(
    @Body() updatePermissionDto: { permissionCode: string[] },
    @Param('id') id: string,
  ) {
    return this.roleService.updatePermission(
      id,
      updatePermissionDto.permissionCode,
    );
  }

  @UseGuards(AtCookieGuard, VerifiedGuard, PermissionsGuard)
  @Permissions({
    action: PermissionAction.DELETE,
    object: PermissionObject.ROLE,
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}
