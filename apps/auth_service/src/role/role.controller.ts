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
import { CreateRoleDto, UpdateRoleDto } from './dto';
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createRole(@Body() CreateRoleDto: CreateRoleDto) {
    return this.roleService.create(CreateRoleDto);
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

  // Update role is obselete ,please use updatePermission instead
  @Patch()
  @HttpCode(HttpStatus.OK)
  async update(@Body() UpdateRoleDto: UpdateRoleDto) {
    return this.roleService.update(UpdateRoleDto);
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
