import { IsNotEmpty, IsEmail } from 'class-validator';
import { User } from '../../users/entities/user.entity';
export class ForgotPasswordEmailDto implements Pick<User, 'email'> {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
