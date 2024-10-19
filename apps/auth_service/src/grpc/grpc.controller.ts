import {
  Controller,
  UseFilters,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersGrpcService } from './grpc.service';
import {
  permissionResponse,
  UsersServiceControllerMethods,
  UsersServiceController,
} from '@app/common';
import { GetUserRequestDto } from './dto/getUserRequest.dto';
import { Http2gRPCExceptionFilter } from '../common/exceptions';
import { Validator } from 'class-validator';
import { plainToClass } from 'class-transformer';
@UseFilters(new Http2gRPCExceptionFilter())
@Controller()
@UsersServiceControllerMethods()
export class GrpcController implements UsersServiceController {
  constructor(private readonly usersGrpcService: UsersGrpcService) {}
  async getUser(request: GetUserRequestDto) {
    const validator = new Validator();
    const entity = plainToClass(GetUserRequestDto, request);
    const errors = await validator.validate(entity);
    if (errors.length > 0) {
      const message = [];
      for (const error of errors) {
        message.push(...Object.values(error.constraints));
      }
      throw new HttpException({ message }, HttpStatus.BAD_REQUEST);
    }
    return await this.usersGrpcService.getUser(request);
  }
  async getUserRoles(request: GetUserRequestDto) {
    const res = await this.usersGrpcService.getUser(request);
    return res.role;
  }
  async getUserPermissions(request: GetUserRequestDto) {
    const res = await this.usersGrpcService.getUser(request);
    const permissions: permissionResponse = {
      permissions: res.role.permissions,
    };
    return permissions;
  }
}
