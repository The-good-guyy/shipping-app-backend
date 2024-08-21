import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { createUserDto, loginUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';
import { RoleService } from '../role/role.service';
import { Tokens } from './types';
import { EErrorMessage } from '../common/constants';
import { KafkaService } from '../kafka';
import { randomBytes } from 'crypto';
import { confirmationEmailPrefix } from '../common/constants';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly redisService: RedisService,
    private readonly roleService: RoleService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    @Inject('AUTH_SERVICE') private client: KafkaService,
  ) {}
  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }
  updateRtHash(userId: string, rt: string, ex?: number) {
    this.redisService.insert(userId, rt, ex);
  }
  sendConfirmationEmail(email: string) {
    const time = this.config.get<number>('EXPIRE_CONFIR_EMAIL_TIME');
    const token = randomBytes(32).toString('hex');
    this.redisService.insert(
      confirmationEmailPrefix + token,
      email,
      Number(time),
    );
    this.client.send({
      topic: 'send-confirmation-email',
      messages: [
        { value: JSON.stringify({ email, token, ttl: time }), key: email },
      ],
    });
  }
  async confirmEmail(token: string) {
    const email = await this.redisService.get(confirmationEmailPrefix + token);
    if (!email) throw new NotFoundException('Token is invalid or expired');
    return await this.usersService.updateVerificationStatus(email);
  }
  async getTokens(userId: string, email: string) {
    const AT_TIME = Number(this.config.get<number>('AT_SECRET_TIME'));
    const RT_TIME = Number(this.config.get<number>('RT_SECRET_TIME'));
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.config.get<string>('AT_SECRET'),
          expiresIn: AT_TIME,
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.config.get<string>('RT_SECRET'),
          expiresIn: RT_TIME,
        },
      ),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }
  async signUpLocal(createUserDto: createUserDto) {
    const role = await this.roleService.findByName('user');
    const hashPassword = await this.hashData(createUserDto.password);
    const newUser = { ...createUserDto, role, password: hashPassword };
    const searchUser = await this.usersService.create(newUser);
    const tokens = await this.getTokens(searchUser.id, searchUser.email);
    this.sendConfirmationEmail(searchUser.email);
    this.updateRtHash(
      searchUser.id,
      tokens.refresh_token,
      this.config.get<number>('RT_SECRET_TIME'),
    );
    return tokens;
  }
  async signInLocal(loginUserDto: loginUserDto): Promise<Tokens> {
    const user = await this.usersService.findByEmailWithSensitiveInfo(
      loginUserDto.email,
    );
    if (!user) throw new NotFoundException(EErrorMessage.ENTITY_NOT_FOUND);
    const passwordMatches = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!passwordMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.email);
    this.updateRtHash(
      user.id,
      tokens.refresh_token,
      this.config.get<number>('RT_SECRET_TIME'),
    );
    return tokens;
  }
  async logout(userId: string): Promise<boolean> {
    this.redisService.delete(userId);
    return true;
  }
  async refreshTokens(userId: string, rt: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new ForbiddenException('Access Denied');
    const cachedItem = await this.redisService.get(userId);
    if (!cachedItem || cachedItem !== rt) {
      this.redisService.delete(userId);
      throw new ForbiddenException('Access Denied');
    }
    const tokens = await this.getTokens(user.id, user.email);
    this.updateRtHash(
      user.id,
      tokens.refresh_token,
      this.config.get<number>('RT_SECRET_TIME'),
    );
    return tokens;
  }
  async getMe(userId: string) {
    const user = await this.usersService.findById(userId);
    return user;
  }
}
