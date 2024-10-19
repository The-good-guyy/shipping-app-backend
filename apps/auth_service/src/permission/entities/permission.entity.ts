import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  ManyToMany,
} from 'typeorm';
import { IsString } from 'class-validator';
import {
  PermissionAction,
  PermissionObject,
  PermissionPossession,
} from 'libs/common/constants';
import { Role } from '../../role/entities/role.entity';
@Entity({ name: 'permission' })
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @IsString()
  permission: string;

  @Column({
    type: 'enum',
    enum: PermissionAction,
  })
  @IsString()
  action: PermissionAction;

  @Column({
    type: 'enum',
    enum: PermissionObject,
  })
  @IsString()
  object: PermissionObject;

  @Column({
    type: 'enum',
    enum: PermissionPossession,
  })
  @IsString()
  possession: PermissionPossession;

  @ManyToMany(() => Role, (role) => role.permission)
  role: Role[];

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @BeforeInsert()
  protected setCreatedAt(): void {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  protected setUpdatedAt(): void {
    this.updatedAt = new Date();
  }
}
