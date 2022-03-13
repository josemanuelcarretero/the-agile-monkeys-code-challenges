import { UserDto } from '../../user/dtos';
import { User } from '../../user/models/user.model';

export class CustomerDto {
  public id: string;
  readonly name: string;
  readonly surname: string;
  readonly external_id: string;
  readonly image: string;
  readonly created_at?: Date;
  readonly created_by?: UserDto;
  readonly updated_at?: Date;
  readonly updated_by?: UserDto;

  constructor(
    id: string,
    name: string,
    surname: string,
    external_id: string,
    image: string,
    created_at: Date,
    created_by: UserDto | User,
    updated_at: Date,
    updated_by: UserDto | User,
  ) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.external_id = external_id;
    this.image = image;
    this.created_at = created_at;
    this.created_by = created_by ? UserDto.create(created_by) : null;
    this.updated_at = updated_at;
    this.updated_by = updated_by ? UserDto.create(updated_by) : null;
  }

  static create(params: {
    id: string;
    name: string;
    surname: string;
    external_id: string;
    image: string;
    created_at: Date;
    created_by: UserDto | User;
    updated_at: Date;
    updated_by: UserDto | User;
  }): CustomerDto {
    return new CustomerDto(
      params.id,
      params.name,
      params.surname,
      params.external_id,
      params.image,
      params.created_at,
      params.created_by,
      params.updated_at,
      params.updated_by,
    );
  }
}
