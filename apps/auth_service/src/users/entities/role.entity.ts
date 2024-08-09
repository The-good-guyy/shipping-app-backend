import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Permission } from './permission.entity';
import { UserRole } from '../../common/constraints';
@Entity({ name: 'role' })
export class Role {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true, type: 'enum', enum: UserRole })
  role: UserRole;

  @ManyToMany(() => Permission, { cascade: true })
  @JoinTable()
  Permission: Permission[];
}
