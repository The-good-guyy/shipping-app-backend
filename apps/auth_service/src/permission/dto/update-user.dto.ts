import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class updateUserDto {
  @IsNotEmpty()
  @IsString()
  uuid;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsUrl()
  profileImage?: string;
}
