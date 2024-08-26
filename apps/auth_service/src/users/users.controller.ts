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
} from '@nestjs/common';
import { UserService } from './users.service';
import { createUserDto, sortUserDto, updateUserDto } from './dto';
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: createUserDto) {
    return this.userService.create(createUserDto);
  }
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOneById(@Param('id') id: string) {
    return this.userService.findById(id);
  }
  @Patch()
  @HttpCode(HttpStatus.OK)
  async update(@Body() updateUserDto: updateUserDto) {
    return this.userService.update(updateUserDto);
  }
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
  @Get(':id/sensitive')
  @HttpCode(HttpStatus.OK)
  async findByIdWithSensitiveInfo(@Param('id') id: string) {
    return this.userService.findByIdWithSensitiveInfo(id);
  }
  @Patch(':id/password')
  @HttpCode(HttpStatus.OK)
  async updatePassword(
    @Param('id') id: string,
    @Body('password') password: string,
  ) {
    return this.userService.updatePassword(id, password);
  }
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query) {
    const queryObj = { ...query };
    const excludedFields = [
      'page',
      'sort',
      'limit',
      'fields',
      'searchTerm',
      'password',
      'skip',
    ];
    excludedFields.forEach((el) => delete queryObj[el]);
    const sortQuery: { orderBy: string; order: string }[] = [];
    if (query.sort) {
      const sortObj = query.sort.split(',');
      // console.log(sortObj);
      for (const obj of sortObj) {
        const [orderBy, order] = obj.split(':');
        console.log(orderBy, order);
        sortQuery.push({ orderBy, order });
      }
    }
    let fieldQuery: string[] = [];
    if (query.fields) {
      fieldQuery = query.fields.split(',');
    }
    console.log(fieldQuery);
    return 'findAll';
  }
}
