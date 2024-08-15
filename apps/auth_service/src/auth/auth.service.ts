import { Injectable, ForbiddenException } from '@nestjs/common';
import { createUserDto, loginUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';
import { RoleService } from '../role/role.service';
import { Tokens } from './types';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly redisService: RedisService,
    private readonly roleService: RoleService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}
  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }
  updateRtHash(userId: string, rt: string) {
    this.redisService.insert(userId, rt);
  }
  async getTokens(userId: string, email: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: this.config.get<string>('AT_SECRET'), expiresIn: 60 * 15 },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.config.get<string>('RT_SECRET'),
          expiresIn: 60 * 60 * 24 * 27,
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
    const newUser = { ...createUserDto, role };
    newUser.password = await this.hashData(newUser.password);
    const searchUser = await this.usersService.create(newUser);
    const tokens = await this.getTokens(searchUser.id, searchUser.email);
    this.updateRtHash(searchUser.id, tokens.refresh_token);
    return tokens;
  }
  async signInLocal(loginUserDto: loginUserDto): Promise<Tokens> {
    const user = await this.usersService.findByEmailWithSensitiveInfo(
      loginUserDto.email,
    );
    const passwordMatches = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!passwordMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.email);
    this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }
  async logout(userId: string): Promise<boolean> {
    this.redisService.delete(userId);
    return true;
  }
  async refreshTokens(userId: string, rt: string) {
    const user = await this.usersService.findById(userId);
    // console.log(userId);
    // console.log(user);
    if (!user) throw new ForbiddenException('Access Denied');
    const cachedItem = await this.redisService.get(userId);
    if (!cachedItem || cachedItem !== rt) {
      this.redisService.delete(userId);
      throw new ForbiddenException('Access Denied');
    }
    const tokens = await this.getTokens(user.id, user.email);
    this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }
  async getMe(userId: string) {
    const user = await this.usersService.findById(userId);
    return user;
  }
}
