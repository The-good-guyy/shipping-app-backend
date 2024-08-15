import {
  Injectable,
  UnprocessableEntityException,
  ForbiddenException,
} from '@nestjs/common';
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
  async getTokens(userId: string, email: string, role: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, role },
        { secret: this.config.get<string>('AT_SECRET'), expiresIn: 60 * 15 },
      ),
      this.jwtService.signAsync(
        { sub: userId, email, role },
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
    const user = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (user) throw new UnprocessableEntityException('Email is already used');
    const hash = await this.hashData(createUserDto.password);
    let newUser = this.usersRepository.create({
      ...createUserDto,
      password: hash,
      createdAt: new Date(),
    });
    newUser = await this.usersRepository.save(newUser);
    const tokens = await this.getTokens(
      newUser.uuid,
      newUser.email,
      newUser.role,
    );
    this.updateRtHash(newUser.uuid, tokens.refresh_token);
    // console.log(newUser.uuid);
    // console.log(await this.cacheManager.get(newUser.uuid));
    return tokens;
  }
  async signInLocal(loginUserDto: loginUserDto): Promise<Tokens> {
    const user = await this.usersRepository.findOne({
      where: { email: loginUserDto.email },
    });
    if (!user) throw new ForbiddenException('Access Denied');
    const passwordMatches = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!passwordMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.uuid, user.email, user.role);
    await this.updateRtHash(user.uuid, tokens.refresh_token);
    return tokens;
  }
  async logout(userId: string): Promise<boolean> {
    this.cacheManager.del(userId);
    return true;
  }
  async refreshTokens(userId: string, rt: string) {
    const user = await this.usersRepository.findOne({
      where: { uuid: userId },
    });
    // console.log(userId);
    // console.log(user);
    if (!user) throw new ForbiddenException('Access Denied');
    const cachedItem = await this.cacheManager.get(userId);
    if (!cachedItem || cachedItem !== rt) {
      this.cacheManager.del(userId);
      throw new ForbiddenException('Access Denied');
    }
    const tokens = await this.getTokens(user.uuid, user.email, user.role);
    this.updateRtHash(user.uuid, tokens.refresh_token);
    return tokens;
  }
  async getMe(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { uuid: userId },
      select: ['uuid', 'username', 'role', 'email'],
    });
    return user;
  }
}
