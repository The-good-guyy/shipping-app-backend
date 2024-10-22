import { IsNotEmpty, IsString, IsEmail, IsUrl } from 'class-validator';
import { User } from '../../users/entities/user.entity';
export class LoginUserDto implements Pick<User, 'email' | 'password'> {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
export class LoginGoogleUserDto
  implements Pick<User, 'email' | 'username' | 'profileImage'>
{
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsUrl()
  profileImage: string;

  @IsNotEmpty()
  @IsString()
  accessToken: string;

  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
