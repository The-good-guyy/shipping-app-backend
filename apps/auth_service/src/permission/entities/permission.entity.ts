import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { IsString } from 'class-validator';
import {
  PermissionAction,
  PermissionObject,
} from 'apps/auth_service/src/common/constraints';
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
