import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUUID,
  IsBoolean,
} from 'class-validator';
import { UserInterface } from '../entities/user.interface';
import { PartialPick } from '../../common/types';
import { Transform } from 'class-transformer';
export class UpdateUserDto
  implements
    PartialPick<
      Pick<UserInterface, 'id' | 'username' | 'isVerified'>,
      'username' | 'isVerified'
    >
{
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsUUID(4)
  roleId?: string;

  @IsOptional()
  @Transform(({ value }) => {
    return value == 'true' || value == 'True';
  })
  @IsBoolean()
  isVerified?: boolean;
}
export class UpdateUserRoleDto implements Pick<UserInterface, 'id'> {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsUUID()
  roleId: string;
}
export class UpdateUserVerifiedDto
  implements Pick<UserInterface, 'id' | 'isVerified'>
{
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @Transform(({ value }) => {
    return value == 'true' || value == 'True';
  })
  @IsBoolean()
  isVerified: boolean;
}
export class UpdateUserAvatarDto implements Pick<UserInterface, 'id'> {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
