import { Module } from '@nestjs/common';
import { RouteController } from './route.controller';
import { RouteService } from './route.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from 'apps/route_service/src/route/entity/route.entity';
import { Port } from 'apps/route_service/src/port/entity/port.entity';
import { PortModule } from 'apps/route_service/src/port/port.module';
import { ScheduleModule } from 'apps/route_service/src/schedule/schedule.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Route, Port]),
    PortModule,
    ScheduleModule,
  ],
  providers: [RouteService],
  controllers: [RouteController],
  exports: [RouteService],
})
export class RouteModule {}
