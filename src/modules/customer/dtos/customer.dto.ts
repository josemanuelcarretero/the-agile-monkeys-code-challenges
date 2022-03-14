import { UserDto } from '../../user/dtos';
import { ApiProperty } from '@nestjs/swagger';
import * as faker from 'faker';
import { v4 as uuid } from 'uuid';
import { User } from '../../user/models/user.model';

export class CustomerDto {
  @ApiProperty({
    description: 'Should be an id of a customer that exists in the database',
    example: uuid(),
  })
  public id: string;
  @ApiProperty({
    description: 'Customer name',
    example: faker.name.firstName(),
  })
  readonly name: string;

  @ApiProperty({
    description: 'Customer surname',
    example: faker.name.lastName(),
  })
  readonly surname: string;

  @ApiProperty({
    description: 'Customer external id',
    example: uuid(),
  })
  readonly external_id: string;

  @ApiProperty({
    description: 'Customer image',
    example: faker.image.avatar(),
    required: false,
  })
  readonly image: string;

  @ApiProperty({
    description: 'Customer created date',
    example: faker.date.past(),
  })
  readonly created_at?: Date;

  @ApiProperty({
    description: 'User that created the customer',
    type: UserDto,
  })
  readonly created_by?: UserDto;

  @ApiProperty({
    description: 'Customer updated date',
    example: faker.date.past(),
  })
  readonly updated_at?: Date;

  @ApiProperty({
    description: 'User who updated customer',
    type: UserDto,
  })
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
