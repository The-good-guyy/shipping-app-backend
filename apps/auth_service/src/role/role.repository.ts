import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { EErrorMessage } from '../common/constraints';
import { createRoleDto } from './dto';
import { Permission } from '../permission/entities/permission.entity';
import { UserRole } from '../common/constraints';
@Injectable()
export class RoleRepository {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}
  async create(createRoleDto: createRoleDto, permissions: Permission[]) {
    const role = await this.roleRepository.findOne({
      where: { role: createRoleDto.role },
    });
    if (role) throw new NotFoundException(EErrorMessage.ENTITY_EXISTED);
    let newRole = this.roleRepository.create({
      ...createRoleDto,
      permission: permissions,
    });
    newRole = await this.roleRepository.save(newRole);
    return newRole;
  }
  async remove() {}
  async update() {}
  async findByCode(roleId: string) {
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    return role;
  }
  async findByName(roleName: string) {
    if (!Object.values(UserRole)?.includes(roleName)) {
      // Do stuff here
    }
    const role = await this.roleRepository.findOne({
      where: { role: roleName },
    });
    return role;
  }
}
