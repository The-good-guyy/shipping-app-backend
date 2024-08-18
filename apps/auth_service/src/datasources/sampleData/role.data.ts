import { RoleInterface } from '../../role/entities/role.interface';
export const roleData: Array<Pick<RoleInterface, 'role' | 'permission'>> = [
  {
    role: 'admin',
    permission: [],
  },
  {
    role: 'user',
    permission: [],
  },
];
