import { UserEntity } from '../../user/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from '../models/customer.model';
import { User } from '../../user/models/user.model';

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

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'updated_by' })
  updated_by: User;

  @Column({ nullable: true })
  deleted_at: Date;

  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
  @JoinColumn({ name: 'deleted_by' })
  deleted_by: User;

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
      this.created_by = params.created_by;
      this.updated_at = params.updated_at;
      this.updated_by = params.updated_by;
      this.deleted_at = params.deleted_at;
      this.deleted_by = params.deleted_by;
    }
  }
}
