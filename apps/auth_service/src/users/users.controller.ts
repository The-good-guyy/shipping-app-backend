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
import { createUserDto, updateUserDto } from './dto';
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

  @Get('getAll')
  @HttpCode(HttpStatus.OK)
  async search(@Query() query) {
    console.log(query);
  }
}
