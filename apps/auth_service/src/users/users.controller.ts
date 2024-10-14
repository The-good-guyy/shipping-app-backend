import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './users.service';
import {
  CreateUserDto,
  UpdateUserDto,
  SearchUsersDto,
  UpdateUserRoleDto,
  UpdateUserVerifiedDto,
} from './dto';
import {
  PermissionsGuard,
  VerifiedGuard,
  AtCookieGuard,
} from '../common/guard';
import { PermissionAction, PermissionObject } from '../common/constants';
import { Permissions, Possessions } from '../common/decorators';
import {
  OffsetPaginationDto,
  OffsetPaginationOptionDto,
  SearchOffsetPaginationDto,
} from '../common/dto';
import { NotFoundInterceptor } from '../common/interceptors';
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(AtCookieGuard, VerifiedGuard, PermissionsGuard)
  @Permissions({
    action: PermissionAction.UPDATE,
    object: PermissionObject.USER,
  })
  @Possessions('body.id')
  @Patch('/role')
  @HttpCode(HttpStatus.OK)
  async updateRole(@Body() UpdateUserRoleDto: UpdateUserRoleDto) {
    return this.userService.updateRole(UpdateUserRoleDto);
  }

  @UseGuards(AtCookieGuard, VerifiedGuard, PermissionsGuard)
  @Permissions({
    action: PermissionAction.UPDATE,
    object: PermissionObject.USER,
  })
  @Possessions('body.id')
  @Patch('/verify')
  @HttpCode(HttpStatus.OK)
  async updateVerify(@Body() UpdateUserVerifiedDto: UpdateUserVerifiedDto) {
    return this.userService.updateVerifiedStatus(UpdateUserVerifiedDto);
  }

  @Post()
  @UseInterceptors(NotFoundInterceptor)
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() CreateUserDto: CreateUserDto) {
    return this.userService.create(CreateUserDto);
  }
  @UseGuards(AtCookieGuard, PermissionsGuard)
  @Permissions({
    action: PermissionAction.READ,
    object: PermissionObject.USER,
  })
  @Possessions('params.id')
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOneById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @UseGuards(AtCookieGuard, VerifiedGuard, PermissionsGuard)
  @Permissions({
    action: PermissionAction.UPDATE,
    object: PermissionObject.USER,
  })
  @Possessions('body.id')
  @Patch('/profile')
  @HttpCode(HttpStatus.OK)
  async update(@Body() UpdateUserDto: UpdateUserDto) {
    return this.userService.update(UpdateUserDto);
  }

  @UseGuards(AtCookieGuard, VerifiedGuard, PermissionsGuard)
  @Permissions({
    action: PermissionAction.DELETE,
    object: PermissionObject.USER,
  })
  @Possessions('params.id')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Get(':id/sensitive')
  @UseInterceptors(NotFoundInterceptor)
  @HttpCode(HttpStatus.OK)
  async findByIdWithSensitiveInfo(@Param('id') id: string) {
    return this.userService.findByIdWithSensitiveInfo(id);
  }

  @Patch(':id/password')
  @UseInterceptors(NotFoundInterceptor)
  @HttpCode(HttpStatus.OK)
  async updatePassword(
    @Param('id') id: string,
    @Body('password') password: string,
  ) {
    return this.userService.updatePassword(id, password);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: SearchUsersDto) {
    const filterQuery = { ...query };
    const excludedFields = [
      'page',
      'sort',
      'limit',
      'fields',
      'searchTerm',
      'password',
      'skip',
    ];
    excludedFields.forEach((el) => delete filterQuery[el]);
    const sortQuery: { orderBy: string; order: string }[] = [];
    if (query.sort) {
      const sortObj = query.sort.split(',');
      for (const obj of sortObj) {
        const [orderBy, order] = obj.split(':');
        sortQuery.push({
          orderBy,
          order: order ? order.toUpperCase() : order,
        });
      }
    }
    let fieldsQuery: string[] = [];
    if (query.fields) {
      fieldsQuery = query.fields.split(',');
    }
    const offset = new OffsetPaginationDto();
    offset.pageNumber = query.page || offset.pageNumber;
    offset.limit = query.limit || offset.limit;
    offset.skip = query.skip || undefined;
    const options = new OffsetPaginationOptionDto();
    options.isGetAll = query.getAll || undefined;
    const searchOffset = new SearchOffsetPaginationDto();
    searchOffset.pagination = offset;
    searchOffset.options = options;
    return await this.userService.search(
      searchOffset,
      filterQuery,
      fieldsQuery,
      sortQuery,
      query.searchTerm,
    );
  }
}
