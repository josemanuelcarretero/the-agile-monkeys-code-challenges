import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserType } from '../enums/user-type.enum';
import { User } from '../models/user.model';

@Entity()
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({})
  name: string;

  @Column({})
  surname: string;

  @Column({ unique: true })
  email: string;

  @Column({})
  password: string;

  @Column({ default: false })
  deleted?: boolean;

  @Column()
  type: UserType;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @Column({ nullable: true })
  deleted_at?: Date;

  constructor(params?: User) {
    super();
    if (params !== null && params !== undefined) {
      this.id = params.id;
      this.email = params.email;
      this.name = params.name;
      this.surname = params.surname;
      this.password = params.password;
      this.deleted = params.deleted;
      this.type = params.type;
      this.created_at = params.created_at;
      this.updated_at = params.updated_at;
      this.deleted_at = params.deleted_at;
    }
  }
}
