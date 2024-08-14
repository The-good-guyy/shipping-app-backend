import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { UserInterface } from '../entities/user.interface';
import { PartialPick } from '../../common/types';
export class updateUserDto
  implements
    PartialPick<
      Pick<UserInterface, 'id' | 'username' | 'profileImage'>,
      'profileImage'
    >
{
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsUrl()
  profileImage?: string;
}
