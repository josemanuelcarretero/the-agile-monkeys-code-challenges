import { UserType } from '../enums/user-type.enum';

export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  type: UserType;
  deleted: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}
