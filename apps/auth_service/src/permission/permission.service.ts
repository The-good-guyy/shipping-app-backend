import { Injectable } from '@nestjs/common';
import { getChangedFields } from '../common/helpers';
import { createPermissionDto, udpatePermissionDto } from './dto';
import { PermissionRepository } from './permission.repository';

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}
  async create(createPermissionDto: createPermissionDto) {
    const newPermission =
      await this.permissionRepository.create(createPermissionDto);
    return newPermission;
  }
  async remove(permissionId: string) {
    await this.permissionRepository.findByCode(permissionId);
    await this.permissionRepository.remove(permissionId);
  }
  async findById(permissionId: string) {
    const permission = await this.permissionRepository.findByCode(permissionId);
    return permission;
  }
  async findByName(permissionName: string) {
    const permission =
      await this.permissionRepository.findByName(permissionName);
    return permission;
  }
  async update(input: udpatePermissionDto) {
    const existingEntity = await this.permissionRepository.findByCode(input.id);

    const updatedData = getChangedFields<udpatePermissionDto>(
      existingEntity,
      input,
    );
    return await this.permissionRepository.update(existingEntity, updatedData);
  }
}
