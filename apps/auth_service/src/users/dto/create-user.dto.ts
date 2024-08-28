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
import { UserInterface } from '../entities/user.interface';
import { Role } from '../../role/entities/role.entity';
import { PartialPick } from '../../common/types';
export class CreateUserDto
  implements
    PartialPick<
      Pick<
        UserInterface,
        'email' | 'password' | 'username' | 'role' | 'profileImage'
      >,
      'profileImage'
    >
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

  @IsObject()
  @ValidateNested()
  @Type(() => Role)
  role: Role;

  @IsOptional()
  @IsUrl()
  profileImage?: string;
}
