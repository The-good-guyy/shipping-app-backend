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
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto, UpdateRoleDto } from './dto';
import { AtGuard, PermissionsGuard, VerifiedGuard } from '../common/guard';
import { PermissionAction, PermissionObject } from '../common/constants';
import { Permissions } from '../common/decorators';
import { NotFoundInterceptor } from '../common/interceptors';
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @UseGuards(AtGuard, VerifiedGuard, PermissionsGuard)
  @Permissions({
    action: PermissionAction.CREATE,
    object: PermissionObject.ROLE,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createRole(@Body() CreateRoleDto: CreateRoleDto) {
    return this.roleService.create(CreateRoleDto);
  }

  @UseGuards(AtGuard, VerifiedGuard, PermissionsGuard)
  @Permissions({
    action: PermissionAction.READ,
    object: PermissionObject.ROLE,
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOneById(@Param('id') id: string) {
    return this.roleService.findById(id);
  }

  @UseGuards(AtGuard, VerifiedGuard, PermissionsGuard)
  @Permissions({
    action: PermissionAction.READ,
    object: PermissionObject.ROLE,
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findOneByName(@Body() findOneByNameDto: { name: string }) {
    return this.roleService.findByName(findOneByNameDto.name);
  }

  // Update role is obselete ,please use updatePermission instead
  @Patch()
  @UseInterceptors(NotFoundInterceptor)
  @HttpCode(HttpStatus.OK)
  async update(@Body() UpdateRoleDto: UpdateRoleDto) {
    return this.roleService.update(UpdateRoleDto);
  }

  @UseGuards(AtGuard, VerifiedGuard, PermissionsGuard)
  @Permissions({
    action: PermissionAction.UPDATE,
    object: PermissionObject.ROLE,
  })
  @Patch(':id')
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

  @UseGuards(AtGuard, VerifiedGuard, PermissionsGuard)
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
