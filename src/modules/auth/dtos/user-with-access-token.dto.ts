import { UserType } from '../../user/enums/user-type.enum';
import { UserDto } from '../../user/dtos';

export class UserWithAccessTokenDto extends UserDto {
  readonly access_token: string;

  constructor(
    id: string,
    name: string,
    surname: string,
    email: string,
    type: UserType,
    access_token: string,
    created_at: Date,
    updated_at: Date,
  ) {
    super(id, name, surname, email, type, created_at, updated_at);
    this.access_token = access_token;
  }

  static create(params: {
    id: string;
    name: string;
    surname: string;
    email: string;
    type: UserType;
    access_token: string;
    created_at: Date;
    updated_at: Date;
  }): UserWithAccessTokenDto {
    return new UserWithAccessTokenDto(
      params.id,
      params.name,
      params.surname,
      params.email,
      params.type,
      params.access_token,
      params.created_at,
      params.updated_at,
    );
  }
}
