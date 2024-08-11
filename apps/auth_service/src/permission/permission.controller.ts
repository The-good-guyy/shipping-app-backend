import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { createPermissionDto } from './dto';
@Controller('permission')
export class AuthController {
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
  @Get('')
  @HttpCode(HttpStatus.OK)
  async findOneByName(name: string) {
    return this.permissionService.findByName(name);
  }
}
