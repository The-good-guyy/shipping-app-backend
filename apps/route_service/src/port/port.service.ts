import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NominatimService } from 'apps/route_service/src/nominatim/nominatim.service';
import { CreatePortDto } from 'apps/route_service/src/port/dto/create-port.dto';
import { FilterPortDto } from 'apps/route_service/src/port/dto/filter-port.dto';
import { UpdatePortDto } from 'apps/route_service/src/port/dto/update-port.dto';
import { Port } from 'apps/route_service/src/port/entity/port.entity';
import { EErrorMessage } from 'libs/common/error';
import { Repository } from 'typeorm';
@Injectable()
export class PortService {
  constructor(
    @InjectRepository(Port)
    private portRepository: Repository<Port>,
    private nominatimService: NominatimService,
  ) {}
  async create(createPortDto: CreatePortDto): Promise<Port> {
    const { address } = createPortDto;
    const { lat, lon } = await this.nominatimService.getCoordinates(address);
    const existingPort = await this.portRepository.findOne({
      where: {
        address: address,
      },
    });

    if (existingPort) {
      throw new NotFoundException(EErrorMessage.PORT_EXISTED);
    }
    const port = this.portRepository.create({
      ...createPortDto,
      lat: lat,
      lon: lon,
    });
    // console.log(port);
    return this.portRepository.save(port);
  }

  async findOne(id: string): Promise<Port> {
    const port = await this.portRepository.findOneBy({ id });

    if (!port) {
      throw new NotFoundException(EErrorMessage.PORT_NOT_FOUND);
    }

    return port;
  }
  async findByAddress(address: string): Promise<Port> {
    const port = await this.portRepository.findOne({ where: { address } });
    if (!port) {
      throw new NotFoundException(`Port with address ${address} not found`);
    }
    return port;
  }
  async remove(id: string): Promise<void> {
    const port = await this.findOne(id);
    if (!port) {
      throw new NotFoundException(EErrorMessage.PORT_NOT_FOUND);
    }
    await this.portRepository.remove(port);
  }

  async update(id: string, updatePortDto: UpdatePortDto): Promise<Port> {
    const port = await this.findOne(id);

    if (!port) {
      throw new NotFoundException(EErrorMessage.PORT_NOT_FOUND);
    }
    if (updatePortDto.address) {
      const { lat, lon } = await this.nominatimService.getCoordinates(
        updatePortDto.address,
      );
      updatePortDto.lat = lat;
      updatePortDto.lon = lon;
    }

    Object.assign(port, updatePortDto);
    return this.portRepository.save(port);
  }

  async findAll(query: FilterPortDto): Promise<any> {
    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;
    const skip = (page - 1) * limit;
    const keyword = (query.search || '').trim().toLowerCase();
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const [result, total] = await this.portRepository
      .createQueryBuilder('port')
      .where("LOWER(REPLACE(port.address, ' ', '')) LIKE LOWER(:keyword)", {
        keyword: `%${keyword.replace(/\s+/g, '')}%`,
      })
      .orderBy(`port.${sortBy}`, sortOrder)
      .skip(skip)
      .take(limit)
      .select([
        'port.id',
        'port.createdAt',
        'port.updatedAt',
        'port.address',
        'port.lat',
        'port.lon',
      ])
      .getManyAndCount();

    const lastPage = Math.ceil(total / limit);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;

    return {
      data: result,
      total,
      currentPage: page,
      nextPage,
      prevPage,
      lastPage,
    };
  }
}
