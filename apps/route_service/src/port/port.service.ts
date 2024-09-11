import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NominatimService } from 'apps/route_service/src/nominatim/nominatim.service';
import { CreatePortDto } from 'apps/route_service/src/port/dto/create-port.dto';
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

    // Nếu tồn tại port trùng lặp, ném ra lỗi
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

  async findAll(): Promise<Port[]> {
    return this.portRepository.find();
  }
}
