import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class updateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsUrl()
  profileImage?: string;
}
