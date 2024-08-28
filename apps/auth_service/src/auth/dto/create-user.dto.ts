import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { User } from '../../users/entities/user.entity';
export class CreateUserDto
  implements Pick<User, 'email' | 'password' | 'username'>
{
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  username: string;
}
