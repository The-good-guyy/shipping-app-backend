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
} from '@nestjs/common';
import { Tokens } from './types';
import { AuthService } from './auth.service';
import { createUserDto, loginUserDto } from './dto';
import { AtGuard, RtGuard } from '../common/guard';
import { GetCurrentUser } from '../common/decorators';
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

  @Post('/verify/:token')
  @HttpCode(HttpStatus.OK)
  verify(@Param('token') token: string): Promise<boolean> {
    return this.authService.confirmEmail(token);
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
