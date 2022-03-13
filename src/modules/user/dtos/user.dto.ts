import { UserType } from '../enums/user-type.enum';

export class UserDto {
  readonly id?: string;

  readonly name: string;

  readonly surname: string;

  readonly email: string;

  readonly type: UserType;

  readonly created_at?: Date;

  readonly updated_at?: Date;

  constructor(
    id: string,
    name: string,
    surname: string,
    email: string,
    type: UserType,
    created_at: Date,
    updated_at: Date,
  ) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.type = type;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  static create(params: {
    id?: string;
    name: string;
    surname: string;
    email: string;
    type: UserType;
    created_at?: Date;
    updated_at?: Date;
  }): UserDto {
    return new UserDto(
      params.id,
      params.name,
      params.surname,
      params.email,
      params.type,
      params.created_at,
      params.updated_at,
    );
  }
}
