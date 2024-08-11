import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { createPermissionDto, udpatePermissionDto } from './dto';
import { EErrorMessage } from '../common/constraints';
@Injectable()
export class PermissionRepository {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}
  async create(createPermissionDto: createPermissionDto) {
    const permission = await this.permissionRepository.findOne({
      where: { permission: createPermissionDto.permission },
    });
    if (permission) throw new NotFoundException(EErrorMessage.ENTITY_EXISTED);
    const newPermission = this.permissionRepository.create({
      ...createPermissionDto,
    });
    return newPermission;
  }
  async remove(permissionId: string): Promise<void> {
    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId },
    });
    if (permission) this.permissionRepository.delete(permission);
  }
  async update(permissionId: string, input: Partial<udpatePermissionDto>) {
    return await this.permissionRepository.update(permissionId, input);
  }
  async findByCode(permissionId: string) {
    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId },
    });
    return permission;
  }
  async findByName(permissionName: string) {
    const permisson = await this.permissionRepository.findOne({
      where: { permission: permissionName },
    });
    return permisson;
  }
}
