import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
  MaxLength,
} from 'class-validator';
import { User } from '../../users/entities/user.entity';
export class ResetForgotPassword implements Pick<User, 'password'> {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(24)
  // @IsStrongPassword()
  password: string;
}
