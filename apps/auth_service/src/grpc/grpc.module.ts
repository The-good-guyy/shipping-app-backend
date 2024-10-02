import { Module } from '@nestjs/common';
import { UserModule } from '../users/users.module';
import { UsersGrpcService } from './grpc.service';
import { GrpcController } from './grpc.controller';
@Module({
  imports: [UserModule],
  controllers: [GrpcController],
  providers: [UsersGrpcService],
  exports: [UsersGrpcService],
})
export class GrpcModule {}
