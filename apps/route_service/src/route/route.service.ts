import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PortService } from 'apps/route_service/src/port/port.service';
import { CreateRouteDto } from 'apps/route_service/src/route/dto/create-route.dto';
import { UpdateRouteDto } from 'apps/route_service/src/route/dto/update-route.dto';
import { Route } from 'apps/route_service/src/route/entity/route.entity';
import { calculateDistance } from 'apps/route_service/src/utils/distance.util';
import { EErrorMessage } from 'libs/common/error';
import { Repository } from 'typeorm';

@Injectable()
export class RouteService {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
    private readonly portService: PortService,
  ) {}

  async create(createRouteDto: CreateRouteDto): Promise<Route> {
    const { startPort_id, endPort_id } = createRouteDto;

    const startPort = await this.portService.findOne(startPort_id);
    const endPort = await this.portService.findOne(endPort_id);

    if (!startPort || !endPort) {
      throw new NotFoundException(EErrorMessage.PORT_NOT_FOUND);
    }

    const existingRoute = await this.routeRepository.findOne({
      where: [
        { startPort: startPort, endPort: endPort },
        { startPort: endPort, endPort: startPort },
      ],
    });

    if (existingRoute) {
      throw new NotFoundException(EErrorMessage.ROUTE_EXISTED);
    }

    // Tính toán khoảng cách
    const distance = calculateDistance(
      startPort.lat,
      startPort.lon,
      endPort.lat,
      endPort.lon,
    );
    const roundedDistance = parseFloat(distance.toFixed(2));

    // Tạo route mới
    const newRoute = this.routeRepository.create({
      ...createRouteDto,
      startPort,
      endPort,
      distance: roundedDistance,
    });

    return this.routeRepository.save(newRoute);
  }

  async findAll(): Promise<Route[]> {
    return this.routeRepository.find();
  }

  async findOne(id: string): Promise<Route> {
    const route = this.routeRepository.findOneBy({ id });
    if (!route) throw new NotFoundException(EErrorMessage.ROUTE_NOT_FOUND);
    return route;
  }

  async update(id: string, updateRouteDto: UpdateRouteDto): Promise<Route> {
    //preload download data from database
    const route = await this.routeRepository.preload({
      id,
      ...updateRouteDto,
    });

    if (!route) {
      throw new NotFoundException(EErrorMessage.ROUTE_NOT_FOUND);
    }

    if (updateRouteDto.startPort_id || updateRouteDto.endPort_id) {
      const startPort = await this.portService.findOne(
        updateRouteDto.startPort_id ?? route.startPort.id,
      );
      const endPort = await this.portService.findOne(
        updateRouteDto.endPort_id ?? route.endPort.id,
      );

      if (startPort && endPort) {
        route.distance = parseFloat(
          calculateDistance(
            startPort.lat,
            startPort.lon,
            endPort.lat,
            endPort.lon,
          ).toFixed(2),
        );
      }
    }

    return this.routeRepository.save(route);
  }

  async remove(id: string): Promise<void> {
    const route = await this.routeRepository.findOneBy({ id });
    if (!route) {
      throw new NotFoundException(EErrorMessage.ROUTE_NOT_FOUND);
    }
    await this.routeRepository.delete(id);
  }
}
