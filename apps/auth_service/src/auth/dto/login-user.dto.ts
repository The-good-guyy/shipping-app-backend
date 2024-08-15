import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { User } from '../../users/entities/user.entity';
export class loginUserDto implements Pick<User, 'email' | 'password'> {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
