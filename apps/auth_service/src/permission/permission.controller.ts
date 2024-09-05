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
} from '@nestjs/common';
import { AtGuard, PermissionsGuard, VerifiedGuard } from '../common/guard';
import { PermissionService } from './permission.service';
import { CreatePermissionDto, UdpatePermissionDto } from './dto';
import { Permissions } from '../common/decorators';
import { PermissionAction, PermissionObject } from '../common/constants';
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

  @UseGuards(AtGuard, VerifiedGuard, PermissionsGuard)
  @Permissions({
    action: PermissionAction.READ,
    object: PermissionObject.PERMISSION,
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOneById(@Param('id') id: string) {
    return this.permissionService.findById(id);
  }

  @UseGuards(AtGuard, VerifiedGuard, PermissionsGuard)
  @Permissions({
    action: PermissionAction.READ,
    object: PermissionObject.PERMISSION,
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findOneByName(@Body() findByNameDto: { name: string }) {
    return this.permissionService.findByName(findByNameDto.name);
  }

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
}
