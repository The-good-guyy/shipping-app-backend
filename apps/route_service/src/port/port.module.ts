import { Module } from '@nestjs/common';
import { PortController } from './port.controller';
import { PortService } from './port.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Port } from 'apps/route_service/src/port/entity/port.entity';
import { NominatimModule } from 'apps/route_service/src/nominatim/nominatim.module';
@Module({
  imports: [TypeOrmModule.forFeature([Port]), NominatimModule],
  controllers: [PortController],
  providers: [PortService],
  exports: [PortService],
})
export class PortModule {}
