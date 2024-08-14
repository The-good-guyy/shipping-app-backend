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
import { PermissionService } from './permission.service';
import { createPermissionDto, udpatePermissionDto } from './dto';
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPermission(@Body() createPermissionDto: createPermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOneById(@Param('id') id: string) {
    return this.permissionService.findById(id);
  }
  @Get()
  @HttpCode(HttpStatus.OK)
  async findOneByName(@Body() findByNameDto: { name: string }) {
    return this.permissionService.findByName(findByNameDto.name);
  }
  @Patch()
  @HttpCode(HttpStatus.OK)
  async update(@Body() udpatePermissionDto: udpatePermissionDto) {
    return this.permissionService.update(udpatePermissionDto);
  }
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.permissionService.remove(id);
  }
}
