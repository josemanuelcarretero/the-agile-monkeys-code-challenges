import { UserType } from '../enums/user-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import * as faker from 'faker';
import { v4 as uuid } from 'uuid';

export class UserDto {
  @ApiProperty({
    description: 'User id',
    example: uuid(),
  })
  readonly id?: string;

  @ApiProperty({
    description: 'User name',
    example: faker.name.firstName(),
  })
  readonly name: string;

  @ApiProperty({
    description: 'User surname',
    example: faker.name.lastName(),
  })
  readonly surname: string;

  @ApiProperty({
    description: 'User email',
    example: faker.internet.email(),
  })
  readonly email: string;

  @ApiProperty({
    description: 'User type',
    enum: UserType,
    example: UserType.ADMIN,
  })
  readonly type: UserType;

  @ApiProperty({
    description: 'User created date',
    example: faker.date.past(),
  })
  readonly created_at?: Date;

  @ApiProperty({
    description: 'User updated date',
    example: faker.date.past(),
  })
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
