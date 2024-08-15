import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  BeforeUpdate,
  BeforeInsert,
} from 'typeorm';
import { Role } from '../../role/entities/role.entity';
@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column({ select: false })
  password: string;

  @Column({
    default:
      'https://firebasestorage.googleapis.com/v0/b/mern-blog-project-28a14.appspot.com/o/profileImage.jpg?alt=media&token=4b00eeb1-6eb8-4c2d-9ba5-1c5fcf7e3d49',
  })
  profileImage: string;

  @Column({ default: false })
  isVerified: boolean;

  @OneToOne(() => Role, { cascade: true })
  @JoinColumn()
  role: Role;

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
