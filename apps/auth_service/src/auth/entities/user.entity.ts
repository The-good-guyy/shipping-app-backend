import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../../common/constraints';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.UNVERIFIED,
  })
  role: UserRole;

  @Column()
  createdAt: Date;
}
