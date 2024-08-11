import { IsNotEmpty, IsString } from 'class-validator';

export class updateUserPasswordDto {
  @IsNotEmpty()
  @IsString()
  password: string;
}
