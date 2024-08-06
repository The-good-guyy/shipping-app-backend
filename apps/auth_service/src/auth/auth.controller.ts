import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { createUserDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post()
  signInLocal(@Body() createUserDto: createUserDto) {
    return this.authService.signInLocal(createUserDto);
  }
}
