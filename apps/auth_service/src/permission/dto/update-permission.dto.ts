import { IsNotEmpty, IsString } from 'class-validator';
import { createPermissionDto } from './create-permission.dto';
export class udpatePermissionDto extends createPermissionDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
