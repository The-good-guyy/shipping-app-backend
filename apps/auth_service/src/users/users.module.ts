import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './users.repository';
import { UserService } from './users.service';
import { RoleModule } from '../role/role.module';
import { UsersController } from './users.controller';
import { UploadModule } from '../upload/upload.module';
@Module({
  imports: [TypeOrmModule.forFeature([User]), RoleModule, UploadModule],
  controllers: [UsersController],
  providers: [UserRepository, UserService],
  exports: [UserService],
})
export class UserModule {}
