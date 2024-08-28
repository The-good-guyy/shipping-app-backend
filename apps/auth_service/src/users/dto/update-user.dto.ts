import {
  IsNotEmpty,
  IsString,
  IsUrl,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { UserInterface } from '../entities/user.interface';
import { PartialPick } from '../../common/types';
export class UpdateUserDto
  implements
    PartialPick<
      Pick<UserInterface, 'id' | 'username' | 'profileImage'>,
      'username' | 'profileImage'
    >
{
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsUrl()
  profileImage?: string;
}
export class updateUserPasswordDto implements Pick<UserInterface, 'password'> {
  @IsNotEmpty()
  @IsString()
  password: string;
}
