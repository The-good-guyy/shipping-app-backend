import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { RoleInterface } from '../entities/role.interface';
import { Type } from 'class-transformer';
import { Permission } from '../../permission/entities/permission.entity';
export class UpdateRoleDto
  implements Pick<RoleInterface, 'id' | 'role' | 'permission'>
{
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  role: string;

  @ValidateNested({ each: true })
  @Type(() => Permission)
  permission: Permission[];
}
