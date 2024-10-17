import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto, ChangePasswordDto } from './dto';
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
import { Permission } from '../permission/entities/permission.entity';
import {
  confirmationEmailPrefix,
  forgotPasswordEmailPrefix,
  forgotPasswordFormPrefix,
} from '../common/constants';
import { User } from '../users/entities/user.entity';
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
  async sendForgotPasswordEmail(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException(EErrorMessage.USER_NOT_FOUND);
    const id = user.id;
    const time = Number(
      this.config.get<number>('EXPIRE_FORGOT_PASSWORD_EMAIL_TIME'),
    );
    const token = await this.jwtService.signAsync(
      { sub: id },
      {
        secret: this.config.get<string>('FORGOT_PASSWORD_SECRET'),
        expiresIn: time,
      },
    );
    this.redisService.insert(
      forgotPasswordEmailPrefix + id,
      token,
      Number(time),
    );
    const forgotPasswordURL =
      this.config.get<string>('AUTH_SERVICE_URL') + '/forgot-password/' + token;
    this.client.send({
      topic: 'send-forgot-password-email',
      messages: [
        {
          value: JSON.stringify({ id, url: forgotPasswordURL, ttl: time }),
          key: id,
        },
      ],
    });
    return { token };
  }
  async confirmForgotPasswordEmail(id: string, token: string) {
    const savedToken = await this.redisService.get(
      forgotPasswordEmailPrefix + id,
    );
    this.redisService.delete(forgotPasswordEmailPrefix + id);
    if (!savedToken || savedToken != token)
      throw new NotFoundException(EErrorMessage.TOKEN_INVALID);
    const newToken = randomBytes(32).toString('hex');
    const time = this.config.get<number>('EXPIRE_FORGOT_PASSWORD_FORM_TIME');
    this.redisService.insert(forgotPasswordFormPrefix + newToken, id, time);
    return { token: newToken };
  }
  async resetForgotPassword(token: string, password: string) {
    const id = await this.redisService.get(forgotPasswordFormPrefix + token);
    if (!id) throw new NotFoundException(EErrorMessage.TOKEN_INVALID);
    this.redisService.delete(forgotPasswordFormPrefix + token);
    const hashPassword = await this.hashData(password);
    await this.usersService.updatePassword(id, hashPassword);
    return true;
  }
  sendConfirmationEmail(email: string) {
    const time = this.config.get<number>('EXPIRE_CONFIR_EMAIL_TIME');
    const token = randomBytes(32).toString('hex');
    this.redisService.insert(
      confirmationEmailPrefix + token,
      email,
      Number(time),
    );
    const emailConfirmationURL =
      this.config.get<string>('AUTH_SERVICE_URL') + '/confirm-email/' + token;
    this.client.send({
      topic: 'send-confirmation-email',
      messages: [
        {
          value: JSON.stringify({
            email,
            url: emailConfirmationURL,
            ttl: time,
          }),
          key: email,
        },
      ],
    });
  }
  async resendEmail(id: string) {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException(EErrorMessage.USER_NOT_FOUND);
    this.sendConfirmationEmail(user.email);
    return true;
  }
  async confirmEmail(token: string) {
    const email = await this.redisService.get(confirmationEmailPrefix + token);
    if (!email) throw new NotFoundException(EErrorMessage.TOKEN_INVALID);
    return await this.usersService.updateVerificationStatus(email);
  }
  async getTokens(
    userId: string,
    email: string,
    isVerified: boolean = false,
    role: string,
    permissions: Partial<Permission>[],
  ): Promise<Tokens> {
    const AT_TIME = Number(this.config.get<number>('AT_SECRET_TIME'));
    const RT_TIME = Number(this.config.get<number>('RT_SECRET_TIME'));
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, isVerified, role, permissions },
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
          // notBefore: AT_TIME - 30,
        },
      ),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }
  async signUpLocal(
    CreateUserDto: CreateUserDto,
  ): Promise<{ user: User; tokens: Tokens }> {
    if (CreateUserDto.password !== CreateUserDto.confirmPassword)
      throw new ForbiddenException(EErrorMessage.PASSWORD_NOT_MATCH);
    const role = await this.roleService.findByName('user');
    const hashPassword = await this.hashData(CreateUserDto.password);
    const newUser = { ...CreateUserDto, role, password: hashPassword };
    const searchUser = await this.usersService.create(newUser);
    searchUser.role.permission = searchUser.role.permission.map((p) => {
      delete p.id;
      delete p.permission;
      delete p.createdAt;
      delete p.updatedAt;
      return p;
    });
    const tokens = await this.getTokens(
      searchUser.id,
      searchUser.email,
      false,
      searchUser.role.role,
      searchUser.role.permission,
    );
    this.sendConfirmationEmail(searchUser.email);
    this.updateRtHash(
      searchUser.id,
      tokens.refresh_token,
      this.config.get<number>('RT_SECRET_TIME'),
    );
    return { user: searchUser, tokens };
  }
  async signInLocal(
    LoginUserDto: LoginUserDto,
  ): Promise<{ user: User; tokens: Tokens }> {
    const user = await this.usersService.findByEmailWithSensitiveInfo(
      LoginUserDto.email,
    );
    if (!user) throw new NotFoundException(EErrorMessage.USER_NOT_FOUND);
    const passwordMatches = await bcrypt.compare(
      LoginUserDto.password,
      user.password,
    );
    if (!passwordMatches)
      throw new ForbiddenException(EErrorMessage.USER_LOGIN_INVALID);
    user.role.permission = user.role.permission.map((p) => {
      delete p.id;
      delete p.permission;
      delete p.createdAt;
      delete p.updatedAt;
      return p;
    });
    const tokens = await this.getTokens(
      user.id,
      user.email,
      user.isVerified,
      user.role.role,
      user.role.permission,
    );
    this.updateRtHash(
      user.id,
      tokens.refresh_token,
      this.config.get<number>('RT_SECRET_TIME'),
    );
    return { user, tokens };
  }
  async logout(userId: string): Promise<boolean> {
    this.redisService.delete(userId);
    return true;
  }
  async refreshTokens(
    userId: string,
    rt: string,
  ): Promise<{ user: User; tokens: Tokens }> {
    const user = await this.usersService.findById(userId);
    if (!user) throw new ForbiddenException(EErrorMessage.USER_NOT_FOUND);
    const [cachedItem, ExpireTime] = await Promise.all([
      this.redisService.get(userId),
      this.redisService.til(userId),
    ]);
    if (!cachedItem || cachedItem !== rt) {
      throw new ForbiddenException(EErrorMessage.TOKEN_INVALID);
    }
    user.role.permission = user.role.permission.map((p) => {
      delete p.id;
      delete p.permission;
      delete p.createdAt;
      delete p.updatedAt;
      return p;
    });
    const tokens = await this.getTokens(
      user.id,
      user.email,
      user.isVerified,
      user.role.role,
      user.role.permission,
    );
    this.updateRtHash(user.id, tokens.refresh_token, ExpireTime);
    return { user, tokens };
  }
  async getMe(userId: string): Promise<User> {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException(EErrorMessage.USER_NOT_FOUND);
    user.role.permission = user.role.permission.map((p) => {
      delete p.id;
      delete p.permission;
      delete p.createdAt;
      delete p.updatedAt;
      return p;
    });
    return user;
  }
  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<boolean> {
    const user = await this.usersService.findByIdWithSensitiveInfo(userId);
    if (!user) throw new NotFoundException(EErrorMessage.USER_NOT_FOUND);
    const passwordMatches = await bcrypt.compare(
      changePasswordDto.password,
      user.password,
    );
    if (!passwordMatches)
      throw new ForbiddenException(EErrorMessage.USER_PASSWORD_INCORRECT);
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword)
      throw new ForbiddenException(EErrorMessage.PASSWORD_NOT_MATCH);
    const hashPassword = await this.hashData(changePasswordDto.newPassword);
    await this.usersService.updatePassword(user.id, hashPassword);
    return true;
  }
}
