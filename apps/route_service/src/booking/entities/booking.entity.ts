import { BookingStatus } from 'apps/route_service/src/booking/enums/booking-status.enum';
import { Route } from 'apps/route_service/src/route/entity/route.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user: string;

  @ManyToOne(() => Route, { eager: true })
  route: Route;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @Column({ type: 'timestamp' })
  departureDate: Date;

  @Column({ type: 'timestamp' })
  arrivalDate: Date;
  @Column({ type: 'float' })
  travelTime: number;
  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;
}
