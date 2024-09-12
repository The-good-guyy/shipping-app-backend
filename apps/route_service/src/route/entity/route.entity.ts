import { Booking } from 'apps/route_service/src/booking/entities/booking.entity';
import { Port } from 'apps/route_service/src/port/entity/port.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('route')
export class Route {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Port, { eager: true })
  @JoinColumn({ name: 'startPort_id' })
  startPort: Port;

  @ManyToOne(() => Port, { eager: true })
  @JoinColumn({ name: 'endPort_id' })
  endPort: Port;
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
  @Column({ type: 'float' })
  distance: number;
}
