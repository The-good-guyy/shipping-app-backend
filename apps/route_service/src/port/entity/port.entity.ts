import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Port {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  lat: number;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  lon: number;
}
