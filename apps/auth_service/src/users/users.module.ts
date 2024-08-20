import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './users.repository';
import { UserService } from './users.service';
import { RoleModule } from '../role/role.module';
import { UsersController } from './users.controller';
@Module({
  imports: [TypeOrmModule.forFeature([User]), RoleModule],
  controllers: [UsersController],
  providers: [UserRepository, UserService],
  exports: [UserService],
})
export class UserModule {}
