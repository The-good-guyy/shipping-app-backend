import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { EErrorMessage } from '../common/constants';
import { createRoleDto, updateRoleDto } from './dto';
import { Permission } from '../permission/entities/permission.entity';
@Injectable()
export class RoleRepository {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}
  async create(createRoleDto: createRoleDto) {
    const role = await this.roleRepository.findOne({
      where: { role: createRoleDto.role },
    });
    if (role) throw new NotFoundException(EErrorMessage.ENTITY_EXISTED);
    let newRole = this.roleRepository.create({
      ...createRoleDto,
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
  async update(updateRoleDto: updateRoleDto) {
    const updatedRole = this.roleRepository.create(updateRoleDto);
    return await this.roleRepository.save(updatedRole);
  }
  async findByCode(roleId: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permission'],
    });
    return role;
  }
  async updatePermissionOnRole(role: Role, permissions: Permission[]) {
    const updatedRole = this.roleRepository.create({
      ...role,
      permission: permissions,
    });
    return await this.roleRepository.save(updatedRole);
  }
  async findByName(roleName: string) {
    const role = await this.roleRepository.findOne({
      where: { role: roleName },
      relations: ['permission'],
    });
    return role;
  }
}
