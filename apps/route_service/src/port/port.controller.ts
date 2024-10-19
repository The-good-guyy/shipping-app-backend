import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreatePortDto } from 'apps/route_service/src/port/dto/create-port.dto';
import { FilterPortDto } from 'apps/route_service/src/port/dto/filter-port.dto';
import { UpdatePortDto } from 'apps/route_service/src/port/dto/update-port.dto';
import { Port } from 'apps/route_service/src/port/entity/port.entity';
import { PortService } from 'apps/route_service/src/port/port.service';
import {
  AtCookieGuard,
  VerifiedGuard,
  PermissionsGuard,
} from 'libs/common/guard';
import { PermissionAction, PermissionObject } from 'libs/common/constants';
import { Permissions, Possessions } from 'libs/common/decorators';
@Controller('port')
export class PortController {
  constructor(private readonly portService: PortService) {}
  @UseGuards(AtCookieGuard, VerifiedGuard, PermissionsGuard)
  @Permissions({
    action: PermissionAction.CREATE,
    object: PermissionObject.ROUTE,
  })
  @Post('create')
  async create(@Body() createPortDto: CreatePortDto): Promise<Port> {
    return this.portService.create(createPortDto);
  }

  @Get()
  async findAll(@Query() query: FilterPortDto): Promise<Port[]> {
    console.log(query);
    return this.portService.findAll(query);
  }

  @UseGuards(AtCookieGuard, VerifiedGuard, PermissionsGuard)
  @Permissions({
    action: PermissionAction.READ,
    object: PermissionObject.ROUTE,
  })
  @Possessions('params.id')
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Port> {
    return this.portService.findOne(id);
  }

  @UseGuards(AtCookieGuard, VerifiedGuard, PermissionsGuard)
  @Permissions({
    action: PermissionAction.UPDATE,
    object: PermissionObject.ROUTE,
  })
  @Possessions('params.id')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePortDto: UpdatePortDto,
  ): Promise<Port> {
    return this.portService.update(id, updatePortDto);
  }

  @UseGuards(AtCookieGuard, VerifiedGuard, PermissionsGuard)
  @Permissions({
    action: PermissionAction.DELETE,
    object: PermissionObject.ROUTE,
  })
  @Possessions('params.id')
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.portService.remove(id);
  }
}
