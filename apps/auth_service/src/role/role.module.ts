import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RoleRepository } from './role.repository';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { PermissionService } from '../permission/permission.service';
@Module({
  imports: [TypeOrmModule.forFeature([Role]), PermissionService],
  controllers: [RoleController],
  providers: [RoleRepository, RoleService],
})
export class RoleModule {}
