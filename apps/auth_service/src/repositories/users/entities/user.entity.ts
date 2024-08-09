import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  BeforeUpdate,
  BeforeInsert,
} from 'typeorm';
import { Role } from './role.entity';
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  profileImage: string;

  @OneToOne(() => Role)
  @JoinColumn()
  role: Role;

  @Column()
  createdAt?: Date;

  @Column()
  updatedAt?: Date;

  @BeforeInsert()
  protected setCreatedAt(): void {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  protected setUpdatedAt(): void {
    this.updatedAt = new Date();
  }
}
