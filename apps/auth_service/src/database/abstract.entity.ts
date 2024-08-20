import { PrimaryGeneratedColumn } from 'typeorm';

export class AbstractEntity<T> {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }
}
