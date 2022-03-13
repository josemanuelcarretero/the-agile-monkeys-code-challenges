import { User } from '../../user/models/user.model';

export interface Customer {
  id: string;
  name: string;
  surname: string;
  external_id: string;
  image: string;
  deleted: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}
