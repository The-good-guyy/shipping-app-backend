import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';
import { PartialPick } from '../../common/types';
import { RoleInterface } from '../entities/role.interface';
export class UpdateRoleDto
  implements PartialPick<Pick<RoleInterface, 'id' | 'role'>, 'role'>
{
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsUUID('4', { each: true })
  permissionId?: string[];
}
