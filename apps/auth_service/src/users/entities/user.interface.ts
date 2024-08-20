import { Role } from '../../role/entities/role.entity';
export interface UserInterface {
  id: string;
  username: string;
  password: string;
  email: string;
  profileImage: string;
  isVerified: boolean;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
