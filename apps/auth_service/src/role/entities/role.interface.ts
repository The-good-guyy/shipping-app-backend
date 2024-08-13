import { Permission } from '../../permission/entities/permission.entity';
export interface RoleInterface {
  id: string;
  role: string;
  permission: Permission[];
  createdAt: Date;
  updatedAt: Date;
}
