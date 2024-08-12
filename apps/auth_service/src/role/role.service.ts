import { Injectable } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { createRoleDto } from './dto';
import { Permission } from '../permission/entities/permission.entity';
import { Role } from './entities/role.entity';
@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}
  async create(createRoleDto: createRoleDto, permissions: Permission[]) {
    return await this.roleRepository.create(createRoleDto, permissions);
  }
  async remove(roleId: string) {
    await this.roleRepository.findByCode(roleId);
    await this.roleRepository.remove(roleId);
  }
  async findById(roleId: string) {
    const role = await this.roleRepository.findByCode(roleId);
    return role;
  }
  async findByName(roleName: string) {
    const role = await this.roleRepository.findByName(roleName);
    return role;
  }
  async asignPermission(role: Role, permissions: Permission[]) {
    await this.roleRepository.findByCode(role.id);
    return this.roleRepository.asignPermission(role, permissions);
  }
}
