import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from '../models/customer.model';

@Entity()
export class CustomerEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({})
  name: string;

  @Column({})
  surname: string;

  @Column({ unique: true })
  external_id: string;

  @Column({ nullable: true })
  image: string;

  @Column({ default: false })
  deleted: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  deleted_at: Date;

  constructor(params?: Customer) {
    super();
    if (params !== null && params !== undefined) {
      this.id = params.id;
      this.external_id = params.external_id;
      this.image = params.image;
      this.name = params.name;
      this.surname = params.surname;
      this.deleted = params.deleted;
      this.created_at = params.created_at;
      this.updated_at = params.updated_at;
      this.deleted_at = params.deleted_at;
    }
  }
}
