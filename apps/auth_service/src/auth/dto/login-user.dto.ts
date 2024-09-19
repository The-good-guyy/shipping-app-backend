import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { User } from '../../users/entities/user.entity';
export class LoginUserDto implements Pick<User, 'email' | 'password'> {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
