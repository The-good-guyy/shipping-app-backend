import { Controller, Get } from '@nestjs/common';
import { RouteServiceService } from './route_service.service';

@Controller()
export class RouteServiceController {
  constructor(private readonly routeServiceService: RouteServiceService) {}

  @Get()
  getHello(): string {
    return this.routeServiceService.getHello();
  }
}
