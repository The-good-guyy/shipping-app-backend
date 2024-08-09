import { IsNotEmpty, IsString, IsEmail, IsEnum, IsDate } from 'class-validator';
import { UserRole } from '../../common/constraints';
export class userDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsString()
  @IsNotEmpty()
  uuid: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: string;

  @IsDate()
  @IsNotEmpty()
  date: Date;
}
