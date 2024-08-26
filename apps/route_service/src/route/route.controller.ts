import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { RouteService } from './route.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { Route } from 'apps/route_service/src/route/entity/route.entity';

@Controller('routes')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Post('create')
  async create(@Body() createRouteDto: CreateRouteDto): Promise<Route> {
    return this.routeService.create(createRouteDto);
  }

  @Get()
  async findAll(): Promise<Route[]> {
    return this.routeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Route> {
    return this.routeService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRouteDto: CreateRouteDto,
  ): Promise<Route> {
    return this.routeService.update(id, updateRouteDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.routeService.remove(id);
  }
}
