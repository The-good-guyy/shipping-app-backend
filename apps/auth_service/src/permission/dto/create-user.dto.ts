import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsObject,
  ValidateNested,
  IsUrl,
  IsOptional,
} from 'class-validator';
import { Role } from '../entities/role.entity';
export class createUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsObject()
  @ValidateNested()
  @Type(() => Role)
  role: Role;

  @IsOptional()
  @IsUrl()
  profileImage?: string;
}
