import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsStrongPassword,
  MinLength,
  MaxLength,
} from 'class-validator';
import { User } from '../../users/entities/user.entity';
export class CreateUserDto
  implements Pick<User, 'email' | 'password' | 'username'>
{
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(24)
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(65)
  username: string;
}
