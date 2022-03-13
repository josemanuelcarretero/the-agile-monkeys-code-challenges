import { User } from '../../user/models/user.model';

export interface Customer {
  id: string;
  name: string;
  surname: string;
  external_id: string;
  image: string;
  deleted: boolean;
  created_at: Date;
  created_by: User;
  updated_at: Date;
  updated_by: User;
  deleted_at?: Date;
  deleted_by?: User;
}
