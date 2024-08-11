import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { PermissionRepository } from './permission.repository';
import { PermissionService } from './permission.service';

@Module({
  imports: [TypeOrmModule.forFeature([Permission])],
  providers: [PermissionRepository, PermissionService],
})
export class PermissionModule {}
