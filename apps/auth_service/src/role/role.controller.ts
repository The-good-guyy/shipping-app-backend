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
} from '@nestjs/common';
import { RoleService } from './role.service';
import { createRoleDto, updateRoleDto } from './dto';
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createRole(@Body() createRoleDto: createRoleDto) {
    return this.roleService.create(createRoleDto);
  }
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOneById(@Param('id') id: string) {
    return this.roleService.findById(id);
  }
  @Get()
  @HttpCode(HttpStatus.OK)
  async findOneByName(@Body() findOneByNameDto: { name: string }) {
    return this.roleService.findByName(findOneByNameDto.name);
  }
  @Patch()
  @HttpCode(HttpStatus.OK)
  async update(@Body() updateRoleDto: updateRoleDto) {
    return this.roleService.update(updateRoleDto);
  }
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
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}
