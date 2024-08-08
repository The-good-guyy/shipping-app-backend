import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from './role.entity';
import { IsString, isString } from 'class-validator';
@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  @IsString()
  permission: string;

  @Column()
  @IsString()
  action: string;

  @ManyToMany(() => Role)
  @JoinTable()
  role: Role[];
}
