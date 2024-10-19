import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
  MaxLength,
} from 'class-validator';
import { User } from '../../users/entities/user.entity';
export class ChangePasswordDto implements Pick<User, 'password'> {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(24)
  // @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(24)
  // @IsStrongPassword()
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(24)
  // @IsStrongPassword()
  confirmPassword: string;
}
