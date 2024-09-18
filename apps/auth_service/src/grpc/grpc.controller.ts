import { Controller } from '@nestjs/common';
import { UsersGrpcService } from './grpc.service';
import {
  GetUserRequest,
  permissionResponse,
  UsersServiceControllerMethods,
  UsersServiceController,
} from '@app/common';

@Controller()
@UsersServiceControllerMethods()
export class GrpcController implements UsersServiceController {
  constructor(private readonly usersGrpcService: UsersGrpcService) {}
  async getUser(request: GetUserRequest) {
    return await this.usersGrpcService.getUser(request);
  }
  async getUserRoles(request: GetUserRequest) {
    const res = await this.usersGrpcService.getUser(request);
    return res.role;
  }
  async getUserPermissions(request: GetUserRequest) {
    const res = await this.usersGrpcService.getUser(request);
    const permissions: permissionResponse = {
      permissions: res.role.permissions,
    };
    return permissions;
  }
}
