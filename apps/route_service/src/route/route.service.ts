import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PortService } from 'apps/route_service/src/port/port.service';
import { CreateRouteDto } from 'apps/route_service/src/route/dto/create-route.dto';
import { UpdateRouteDto } from 'apps/route_service/src/route/dto/update-route.dto';
import { calculateDistance } from 'apps/route_service/src/common/utils/distance.util';
import { EErrorMessage } from 'libs/common/error';
import { Repository } from 'typeorm';
import { FilterRouteDto } from 'apps/route_service/src/route/dto/filter-route.dto';
import { ScheduleService } from 'apps/route_service/src/schedule/schedule.service';
import { Route } from 'apps/route_service/src/route/entity/route.entity';
import { ClientGrpc } from '@nestjs/microservices';
import { RouteStatus } from 'apps/route_service/src/route/enums/route-status.enum';

@Injectable()
export class RouteService {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
    private readonly scheduleService: ScheduleService,
    private readonly portService: PortService,
    @Inject('USER_PACKAGE') private readonly grpcClient: ClientGrpc,
  ) {}

  async create(createRouteDto: CreateRouteDto): Promise<Route> {
    const { startPort_id, endPort_id, departureDate } = createRouteDto;
    const departureDateObj = new Date(departureDate);
    const startPort = await this.portService.findOne(startPort_id);
    const endPort = await this.portService.findOne(endPort_id);
    if (!startPort || !endPort) {
      throw new NotFoundException(EErrorMessage.PORT_NOT_FOUND);
    }
    const distance = calculateDistance(
      startPort.lat,
      startPort.lon,
      endPort.lat,
      endPort.lon,
    );
    const roundedDistance = parseFloat(distance.toFixed(2));
    const travelTime = this.scheduleService.calculateTravelTime(distance);
    const arrivalDate = this.scheduleService.calculateArrivalDate(
      departureDateObj,
      travelTime,
    );
    const existingRoute = await this.routeRepository.findOne({
      where: {
        startPort: { id: startPort.id },
        endPort: { id: endPort.id },
        arrivalDate,
      },
    });
    // console.log(existingRoute);
    if (existingRoute) {
      throw new NotFoundException(EErrorMessage.ROUTE_EXISTED);
    }

    const newRoute = this.routeRepository.create({
      ...createRouteDto,
      startPort,
      endPort,
      travelTime,
      arrivalDate,
      distance: roundedDistance,
    });
    console.log(newRoute);
    return this.routeRepository.save(newRoute);
  }

  async findAll(query: FilterRouteDto): Promise<any> {
    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;
    const skip = (page - 1) * limit;
    const keyword = (query.search || '').trim().toLowerCase();

    const sortBy = query.sortBy || 'createdAt';
    const sortOrder: 'ASC' | 'DESC' =
      query.order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const queryBuilder = this.routeRepository
      .createQueryBuilder('route')
      .leftJoinAndSelect('route.startPort', 'startPort')
      .leftJoinAndSelect('route.endPort', 'endPort')
      .where(
        "(LOWER(REPLACE(startPort.address, ' ', '')) LIKE LOWER(:keyword) OR LOWER(REPLACE(endPort.address, ' ', '')) LIKE LOWER(:keyword))",
        { keyword: `%${keyword.replace(/\s+/g, '')}%` },
      );

    // if (query.createdAt) {
    //   queryBuilder.andWhere('route.createdAt >= :createdAt', {
    //     createdAt: query.createdAt,
    //   });
    // }
    // if (query.updatedAt) {
    //   queryBuilder.andWhere('route.updatedAt >= :updatedAt', {
    //     updatedAt: query.updatedAt,
    //   });
    // }

    switch (sortBy) {
      case 'startPort':
        queryBuilder.orderBy('startPort.address', sortOrder);
        break;
      case 'endPort':
        queryBuilder.orderBy('endPort.address', sortOrder);
        break;
      case 'updatedAt':
        queryBuilder.orderBy('route.updatedAt', sortOrder);
        break;
      case 'status':
        queryBuilder.orderBy('route.status', sortOrder);
        break;
      default:
        queryBuilder.orderBy('route.createdAt', sortOrder);
        break;
    }

    // Phan trang
    queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy(`route.${sortBy}`, sortOrder)
      .select([
        'route.id',
        'route.createdAt',
        'route.updatedAt',
        'route.distance',
        'route.departureDate',
        'route.arrivalDate',
        'route.travelTime',
        'route.status',
        'startPort.address',
        'endPort.address',
      ]);

    const [result, total] = await queryBuilder.getManyAndCount();

    const lastPage = Math.ceil(total / limit);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;
    // console.log(result);
    return {
      data: result,
      total,
      currentPage: page,
      nextPage,
      prevPage,
      lastPage,
    };
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
  async updateRouteStatus(id: string): Promise<Route> {
    const route = await this.routeRepository.findOneBy({ id });

    if (!route) {
      throw new NotFoundException(EErrorMessage.ROUTE_NOT_FOUND);
    }

    switch (route.status) {
      case RouteStatus.AVAILABLE:
        route.status = RouteStatus.TRANSIT;
        break;
      case RouteStatus.TRANSIT:
        route.status = RouteStatus.COMPLETED;
        break;
      case RouteStatus.COMPLETED:
        throw new BadRequestException(
          'Route is already completed and cannot be updated further.',
        );
      default:
        throw new BadRequestException('Invalid route status');
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
