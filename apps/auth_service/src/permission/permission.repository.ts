import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto, UdpatePermissionDto } from './dto';
import { EErrorMessage } from '../common/constants';
@Injectable()
export class PermissionRepository {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}
  async create(CreatePermissionDto: CreatePermissionDto) {
    const permission = await this.permissionRepository.findOne({
      where: { permission: CreatePermissionDto.permission },
    });
    if (permission) throw new NotFoundException(EErrorMessage.ENTITY_EXISTED);
    let newPermission = this.permissionRepository.create({
      ...CreatePermissionDto,
    });
    newPermission = await this.permissionRepository.save(newPermission);
    return newPermission;
  }
  async remove(permissionId: string): Promise<void> {
    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId },
    });
    if (permission) this.permissionRepository.delete(permission);
  }
  // async update(permissionId: string, input: Partial<UdpatePermissionDto>) {
  //   return await this.permissionRepository.update(permissionId, {
  //     ...input,
  //     updatedAt: new Date(),
  //   });
  // }
  async update(permission: Permission, input: Partial<UdpatePermissionDto>) {
    if (input.id) {
      delete input['id'];
    }
    const updatedPermission = this.permissionRepository.create({
      ...permission,
      ...input,
    });
    return await this.permissionRepository.save(updatedPermission);
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
