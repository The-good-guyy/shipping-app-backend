import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  BeforeUpdate,
  BeforeInsert,
} from 'typeorm';
import { Permission } from '../../permission/entities/permission.entity';
import { UserRole } from '../../common/constraints';
@Entity({ name: 'role' })
export class Role {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true, type: 'enum', enum: UserRole })
  role: UserRole;

  @ManyToMany(() => Permission, { cascade: true })
  @JoinTable()
  permission: Permission[];

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @BeforeInsert()
  protected setCreatedAt(): void {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  protected setUpdatedAt(): void {
    this.updatedAt = new Date();
  }
}
