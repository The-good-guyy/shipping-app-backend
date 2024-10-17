import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';
import { RoleInterface } from '../entities/role.interface';
export class CreateRoleDto implements Pick<RoleInterface, 'role'> {
  @IsNotEmpty()
  @IsString()
  role: string;

  @IsOptional()
  @IsUUID('4', { each: true })
  permissionId?: string[];
}
