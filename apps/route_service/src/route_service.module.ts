import { Module } from '@nestjs/common';
import { RouteServiceController } from './route_service.controller';
import { RouteServiceService } from './route_service.service';
import { PortModule } from './port/port.module';
import { RouteModule } from './route/route.module';
import { NominatimModule } from './nominatim/nominatim.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Port } from 'apps/route_service/src/port/entity/port.entity';
import { Route } from 'apps/route_service/src/route/entity/route.entity';
import { ConfigService } from '@nestjs/config';
import { BookingModule } from './booking/booking.module';
import { ScheduleModule } from './schedule/schedule.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['./env/postgres.env', './env/ggkey.env'],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('POSTGRES_HOST'),
        port: configService.getOrThrow('POSTGRES_PORT'),
        username: configService.getOrThrow('POSTGRES_USER'),
        password: configService.getOrThrow('POSTGRES_PASSWORD'),
        database: configService.getOrThrow('POSTGRES_DB'),
        entities: [Port, Route],
        autoLoadEntities: true,
        synchronize: configService.getOrThrow('POSTGRES_SYNCHRONIZE'),
      }),
    }),
    PortModule,
    RouteModule,
    NominatimModule,
    BookingModule,
    ScheduleModule,
  ],
  controllers: [RouteServiceController],
  providers: [RouteServiceService],
})
export class RouteServiceModule {}
