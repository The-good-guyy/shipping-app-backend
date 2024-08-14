import { IsNotEmpty, IsString } from 'class-validator';
import { UserInterface } from '../entities/user.interface';
export class updateUserPasswordDto implements Pick<UserInterface, 'password'> {
  @IsNotEmpty()
  @IsString()
  password: string;
}
