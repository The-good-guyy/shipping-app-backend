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
  RtGuard,
  PermissionsGuard,
  VerifiedGuard,
  ForgotPasswordGuard,
} from '../common/guard';
import { GetCurrentUser, Permissions, Possessions } from '../common/decorators';
import { PermissionAction, PermissionObject } from '../common/constants';
// import { KafkaService } from '../kafka';
// import { SubscribeTo } from '../kafka';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    // @Inject('AUTH_SERVICE') private client: KafkaService,
  ) {}

  // onModuleInit(): void {
  //   this.client.subscribeToResponseOf('send-confirmation-email', this);
  // }
  // @SubscribeTo('send-confirmation-email')
  // async getWorld(
  //   data: any,
  //   key: any,
  //   offset: number,
  //   timestamp: number,
  //   partition: number,
  // ): Promise<void> {
  //   const dataObj = JSON.parse(data);
  //   console.log(dataObj, key, offset, timestamp, partition);
  // }
  @Post('/local/signup')
  @HttpCode(HttpStatus.CREATED)
  signInLocal(@Body() CreateUserDto: CreateUserDto): Promise<Tokens> {
    return this.authService.signUpLocal(CreateUserDto);
  }
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  siginLocal(@Body() LoginUserDto: LoginUserDto): Promise<Tokens> {
    return this.authService.signInLocal(LoginUserDto);
  }
  @UseGuards(AtGuard)
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUser('sub') userId: string): Promise<boolean> {
    return this.authService.logout(userId);
  }

  @Post('/verify/:token')
  @HttpCode(HttpStatus.OK)
  verify(@Param('token') token: string): Promise<boolean> {
    return this.authService.confirmEmail(token);
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
