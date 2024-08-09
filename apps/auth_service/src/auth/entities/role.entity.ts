import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Permission } from './permission.entity';
@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  role: string;

  @ManyToMany(() => Permission)
  @JoinTable()
  Permission: Permission[];
}