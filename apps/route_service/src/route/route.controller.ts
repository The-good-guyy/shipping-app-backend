import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';
import { RouteService } from './route.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { FilterRouteDto } from 'apps/route_service/src/route/dto/filter-route.dto';
import { Route } from 'apps/route_service/src/route/entity/route.entity';
import { UpdateRouteDto } from 'apps/route_service/src/route/dto/update-route.dto';
@Controller('routes')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Post('create')
  async create(@Body() createRouteDto: CreateRouteDto): Promise<Route> {
    return this.routeService.create(createRouteDto);
  }

  @Get()
  async findAll(@Query() query: FilterRouteDto): Promise<Route[]> {
    console.log(query);
    return this.routeService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Route> {
    return this.routeService.findOne(id);
  }
  // @Get('find-by-port')
  // async findRoutesByPort(
  //   @Query('port') portName: string,
  //   @Query('type') type?: string,
  // ): Promise<Route[]> {
  //   return this.routeService.findRoutesByPort(portName, type);
  // }
  // @Get('search')
  // async searchRoutes(
  //   @Query() searchRouteDto: SearchRouteDto,
  // ): Promise<Route[]> {
  //   return this.routeService.findRoutes(searchRouteDto);
  // }
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRouteDto: UpdateRouteDto,
  ): Promise<Route> {
    return this.routeService.update(id, updateRouteDto);
  }
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string): Promise<Route> {
    return this.routeService.updateRouteStatus(id);
  }
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.routeService.remove(id);
  }
}
