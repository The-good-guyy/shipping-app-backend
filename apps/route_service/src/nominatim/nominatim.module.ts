import { Module } from '@nestjs/common';
import { NominatimService } from './nominatim.service';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [HttpModule],
  providers: [NominatimService],
  exports: [NominatimService],
})
export class NominatimModule {}
