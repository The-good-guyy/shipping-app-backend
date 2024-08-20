import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
} from '@nestjs/common';
import { Tokens } from './types';
import { AuthService } from './auth.service';
import { createUserDto, loginUserDto } from './dto';
import { AtGuard, RtGuard } from '../common/guard';
import { GetCurrentUser } from '../common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/local/signup')
  @HttpCode(HttpStatus.CREATED)
  signInLocal(@Body() createUserDto: createUserDto): Promise<Tokens> {
    return this.authService.signUpLocal(createUserDto);
  }
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  siginLocal(@Body() loginUserDto: loginUserDto): Promise<Tokens> {
    return this.authService.signInLocal(loginUserDto);
  }
  @UseGuards(AtGuard)
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUser('sub') userId: string): Promise<boolean> {
    return this.authService.logout(userId);
  }

  @UseGuards(RtGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUser('sub') userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @UseGuards(AtGuard)
  @Get('/getMe')
  @HttpCode(HttpStatus.OK)
  getMe(@GetCurrentUser('sub') userId: string) {
    console.log(userId);
    return this.authService.getMe(userId);
  }

  @Get()
  getHello(): string {
    return 'get auth';
  }
}
