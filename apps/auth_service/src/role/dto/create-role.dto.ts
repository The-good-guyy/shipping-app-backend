import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { RoleInterface } from '../entities/role.interface';
import { Type } from 'class-transformer';
import { Permission } from '../../permission/entities/permission.entity';
export class CreateRoleDto
  implements Pick<RoleInterface, 'role' | 'permission'>
{
  @IsNotEmpty()
  @IsString()
  role: string;

  @ValidateNested({ each: true })
  @Type(() => Permission)
  permission: Permission[];
}
