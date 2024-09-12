import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PortService } from 'apps/route_service/src/port/port.service';
import { CreateRouteDto } from 'apps/route_service/src/route/dto/create-route.dto';
import { UpdateRouteDto } from 'apps/route_service/src/route/dto/update-route.dto';
import { Route } from 'apps/route_service/src/route/entity/route.entity';
import { calculateDistance } from 'apps/route_service/src/common/utils/distance.util';
import { EErrorMessage } from 'libs/common/error';
import { Repository } from 'typeorm';
import { SearchRouteDto } from 'apps/route_service/src/route/dto/searchRoute.dto';

@Injectable()
export class RouteService {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
    private readonly portService: PortService,
  ) {}

  async create(createRouteDto: CreateRouteDto): Promise<Route> {
    const { startPort_address, endPort_address } = createRouteDto;

    const startPort = await this.portService.findByAddress(startPort_address);
    const endPort = await this.portService.findByAddress(endPort_address);
    if (!startPort || !endPort) {
      throw new NotFoundException(EErrorMessage.PORT_NOT_FOUND);
    }

    const existingRoute = await this.routeRepository.findOne({
      where: [{ startPort: startPort, endPort: endPort }],
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

  // async findRoutesByPort(portName: string, type?: string): Promise<Route[]> {
  //   const queryBuilder = this.routeRepository
  //     .createQueryBuilder('Route')
  //     .leftJoinAndSelect('Route.startPort', 'startPort')
  //     .leftJoinAndSelect('Route.endPort', 'endPort');

  //   if (!type || type === 'both') {
  //     queryBuilder
  //       .where('startPort.address = :portName', { portName })
  //       .orWhere('endPort.address = :portName', { portName });
  //   } else if (type === 'start') {
  //     queryBuilder.where('startPort.address = :portName', { portName });
  //   } else if (type === 'end') {
  //     queryBuilder.where('endPort.address = :portName', { portName });
  //   }
  //   console.log(queryBuilder);
  //   return queryBuilder.getMany();
  // }
  // async findRoutes(searchRouteDto: SearchRouteDto): Promise<Route[]> {
  //   const {
  //     portName,
  //     type,
  //     page = 1,
  //     limit = 10,
  //     createdFrom,
  //     createdTo,
  //     updatedFrom,
  //     updatedTo,
  //   } = searchRouteDto;

  //   const queryBuilder = this.routeRepository
  //     .createQueryBuilder('route')
  //     .leftJoinAndSelect('route.startPort', 'startPort')
  //     .leftJoinAndSelect('route.endPort', 'endPort');

  //   if (portName) {
  //     if (!type || type === 'both') {
  //       queryBuilder
  //         .where('startPort.address = :portName', { portName })
  //         .orWhere('endPort.address = :portName', { portName });
  //     } else if (type === 'start') {
  //       queryBuilder.where('startPort.address = :portName', { portName });
  //     } else if (type === 'end') {
  //       queryBuilder.where('endPort.address = :portName', { portName });
  //     }
  //   }

  //   if (createdFrom) {
  //     queryBuilder.andWhere('route.createdDate >= :createdFrom', {
  //       createdFrom,
  //     });
  //   }
  //   if (createdTo) {
  //     queryBuilder.andWhere('route.createdDate <= :createdTo', { createdTo });
  //   }

  //   if (updatedFrom) {
  //     queryBuilder.andWhere('route.updatedDate >= :updatedFrom', {
  //       updatedFrom,
  //     });
  //   }
  //   if (updatedTo) {
  //     queryBuilder.andWhere('route.updatedDate <= :updatedTo', { updatedTo });
  //   }
  //   // Thực hiện phân trang
  //   queryBuilder.skip((page - 1) * limit).take(limit);

  //   return queryBuilder.getMany();
  // }
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
