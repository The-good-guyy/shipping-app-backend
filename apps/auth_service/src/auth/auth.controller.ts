import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { createUserDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signin/local')
  signInLocal(@Body() createUserDto: createUserDto) {
    return this.authService.signInLocal(createUserDto);
  }
}

// import {
//   Controller,
//   Post,
//   Body,
//   HttpCode,
//   HttpStatus,
//   UseGuards,
//   Req,
//   Res,
// } from '@nestjs/common';
// import { Response } from 'express';
// import { AuthService } from './auth.service';
// import { AuthDto } from './dto/auth.dto';
// import { Tokens } from './types';
// import { AtGuard, RtGuard } from 'src/common/guard';
// import { GetCurrentUser } from 'src/common/decorators';

// @Controller('auth')
// export class AuthController {
//   constructor(private authService: AuthService) {}
//   @Post('local/signup')
//   @HttpCode(HttpStatus.CREATED)
//   signupLocal(
//     @Body() authDto: AuthDto,
//     @Res({ passthrough: true }) response: Response,
//   ): Promise<Tokens> {
//     return this.authService.signupLocal(authDto, response);
//   }

//   @Post('local/sigin')
//   @HttpCode(HttpStatus.OK)
//   siginLocal(@Body() authDto: AuthDto): Promise<Tokens> {
//     return this.authService.signinLocal(authDto);
//   }

//   @UseGuards(AtGuard)
//   @Post('/logout')
//   @HttpCode(HttpStatus.OK)
//   logout(@GetCurrentUser('sub') userId: number): Promise<boolean> {
//     return this.authService.logout(userId);
//   }

//   @UseGuards(RtGuard)
//   @Post('/refresh')
//   @HttpCode(HttpStatus.OK)
//   refreshTokens(
//     @GetCurrentUser('sub') userId: number,
//     @GetCurrentUser('refreshToken') refreshToken: string,
//   ): Promise<Tokens> {
//     // console.log(refreshToken);
//     return this.authService.refreshTokens(userId, refreshToken);
//   }
// }
