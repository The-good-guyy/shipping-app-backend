import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './users.repository';
import { UserService } from './users.service';
import { RoleModule } from '../role/role.module';
@Module({
  imports: [TypeOrmModule.forFeature([User]), RoleModule],
  providers: [UserRepository, UserService],
})
export class UserModule {}
