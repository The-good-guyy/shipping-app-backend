import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from './role.entity';
@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  permission: string;

  @ManyToMany(() => Role)
  @JoinTable()
  categories: Role[];
}
