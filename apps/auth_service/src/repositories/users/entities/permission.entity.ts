import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from './role.entity';
import { IsString } from 'class-validator';
@Entity({ name: 'permission' })
export class Permission {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  @IsString()
  permission: string;

  @Column()
  @IsString()
  action: string;

  @Column()
  @IsString()
  object: string;

  @ManyToMany(() => Role)
  @JoinTable()
  role: Role[];
}
