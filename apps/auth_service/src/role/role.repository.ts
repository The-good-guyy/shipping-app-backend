import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { EErrorMessage } from '../common/constraints';
import { createRoleDto } from './dto';
import { Permission } from '../permission/entities/permission.entity';
import { UserRole } from '../common/constraints';
import { stringToEnum } from '../common/helpers';
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
  async remove(roleId: string): Promise<void> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
    });
    if (role) this.roleRepository.delete(role);
  }
  async update() {}
  async findByCode(roleId: string) {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permission'],
    });
    return role;
  }
  async asignPermission(role: Role, permissions: Permission[]) {
    const updatedRole = this.roleRepository.create({
      ...role,
      permission: permissions,
    });
    return await this.roleRepository.save(updatedRole);
  }
  async findByName(roleName: string) {
    const enumValue = stringToEnum(UserRole, roleName);
    if (!enumValue) {
      throw new NotFoundException(EErrorMessage.SOME_ROLES_NOT_FOUND);
    }
    const role = await this.roleRepository.findOne({
      where: { role: enumValue },
      relations: ['permission'],
    });
    return role;
  }
}
