import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../../common/constraints';
export class createRoleDto {
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}
