import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { CreatePortDto } from 'apps/route_service/src/port/dto/create-port.dto';
import { UpdatePortDto } from 'apps/route_service/src/port/dto/update-port.dto';
import { Port } from 'apps/route_service/src/port/entity/port.entity';
import { PortService } from 'apps/route_service/src/port/port.service';

@Controller('port')
export class PortController {
  constructor(private readonly portService: PortService) {}
  @Post('create')
  async create(@Body() createPortDto: CreatePortDto): Promise<Port> {
    return this.portService.create(createPortDto);
  }

  @Get()
  async findAll(): Promise<Port[]> {
    return this.portService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Port> {
    return this.portService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePortDto: UpdatePortDto,
  ): Promise<Port> {
    return this.portService.update(id, updatePortDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.portService.remove(id);
  }
}
