import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Param,
  Inject,
  Req,
  Res,
  UseFilters,
} from '@nestjs/common';
import { Tokens } from './types';
import { AuthService } from './auth.service';
import {
  CreateUserDto,
  LoginUserDto,
  ResetForgotPassword,
  ForgotPasswordEmailDto,
} from './dto';
import {
  AtGuard,
  AtCookieGuard,
  RtCookieGuard,
  PermissionsGuard,
  VerifiedGuard,
  ForgotPasswordGuard,
  RtGuard,
} from '../common/guard';
import { GetCurrentUser, Permissions, Possessions } from '../common/decorators';
import { PermissionAction, PermissionObject } from '../common/constants';
import { Response, Request } from 'express';
import { User } from '../users/entities/user.entity';
import { RtGuardExceptionFilter } from '../common/exceptions';
// import { KafkaService } from '../kafka';
// import { SubscribeTo } from '../kafka';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/local/signup')
  @HttpCode(HttpStatus.CREATED)
  async signUpLocal(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
    @Body() CreateUserDto: CreateUserDto,
  ): Promise<User> {
    const { tokens, user } = await this.authService.signUpLocal(CreateUserDto);
    response.cookie('access_token', tokens.access_token, {
      expires: new Date(Date.now() + 900 * 1000),
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    });
    response.cookie('refresh_token', tokens.refresh_token, {
      expires: new Date(Date.now() + 2332800 * 1000),
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    });
    return user;
  }

  // @Post('local/signin')
  // @HttpCode(HttpStatus.OK)
  // siginLocal(@Body() LoginUserDto: LoginUserDto) {
  //   return this.authService.signInLocal(LoginUserDto);
  // }

  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  async signInLocal(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
    @Body() LoginUserDto: LoginUserDto,
  ) {
    const { tokens, user } = await this.authService.signInLocal(LoginUserDto);
    response.cookie('access_token', tokens.access_token, {
      expires: new Date(Date.now() + 900 * 1000),
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    });
    response.cookie('refresh_token', tokens.refresh_token, {
      expires: new Date(Date.now() + 2332800 * 1000),
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    });
    return user;
  }

  @UseGuards(AtCookieGuard)
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @Res({ passthrough: true }) response,
    @GetCurrentUser('sub') userId: string,
  ): Promise<boolean> {
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');
    return this.authService.logout(userId);
  }

  @UseGuards(AtGuard)
  @Get('/verify')
  @HttpCode(HttpStatus.OK)
  resendEmail(@GetCurrentUser('sub') userId: string) {
    return this.authService.resendEmail(userId);
  }
  @UseGuards(AtGuard)
  @Post('/reset-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@GetCurrentUser('email') email: string): Promise<boolean> {
    return this.authService.sendResetPasswordEmail(email);
  }
  // @UseGuards(RtGuard)
  // @Post('/refresh')
  // @HttpCode(HttpStatus.OK)
  // refreshTokens(
  //   @GetCurrentUser('sub') userId: string,
  //   @GetCurrentUser('refreshToken') refreshToken: string,
  // ): Promise<Tokens> {
  //   return this.authService.refreshTokens(userId, refreshToken);
  // }

  @UseGuards(RtCookieGuard)
  @Post('/refresh')
  @UseFilters(RtGuardExceptionFilter)
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
    @GetCurrentUser('sub') userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    console.log('refreshTokens');
    const { user, tokens } = await this.authService.refreshTokens(
      userId,
      refreshToken,
    );
    response.cookie('access_token', tokens.access_token, {
      expires: new Date(Date.now() + 900 * 1000),
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    });
    response.cookie('refresh_token', tokens.refresh_token, {
      expires: new Date(Date.now() + 2332800 * 1000),
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    });
    return user;
  }

  @UseGuards(AtCookieGuard)
  @Get('/getMe')
  @HttpCode(HttpStatus.OK)
  getMe(@GetCurrentUser('sub') userId: string) {
    return this.authService.getMe(userId);
  }

  @UseGuards(AtGuard, VerifiedGuard, PermissionsGuard)
  @Permissions({ action: PermissionAction.READ, object: PermissionObject.USER })
  @Possessions('body.id')
  @Post()
  postHello(@Body() body) {
    return body;
  }

  @Post('/forgot-password')
  sendForgotPasswordEmail(
    @Body() ForgotPasswordEmailDto: ForgotPasswordEmailDto,
  ) {
    return this.authService.sendForgotPasswordEmail(
      ForgotPasswordEmailDto.email,
    );
  }

  @UseGuards(ForgotPasswordGuard)
  @Get('/forgot-password/:token')
  confirmForgotPassword(
    @GetCurrentUser('sub') userId: string,
    @Param('token') token: string,
  ) {
    return this.authService.confirmForgotPasswordEmail(userId, token);
  }

  @Post('/reset-forgot-password/:token')
  resetPassword(
    @Param('token') token: string,
    @Body() ResetForgotPassword: ResetForgotPassword,
  ) {
    return this.authService.resetForgotPassword(
      token,
      ResetForgotPassword.password,
    );
  }

  @UseGuards(AtCookieGuard)
  @Post('/cookie')
  postCookie() {
    return 'body';
  }

  @UseGuards(AtGuard)
  @Get()
  getHello(@GetCurrentUser() user: any) {
    return user;
  }

  @Get('/test')
  test(@Res({ passthrough: true }) res) {
    res.cookie('access_token', 'test', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    return 'test';
  }
}
