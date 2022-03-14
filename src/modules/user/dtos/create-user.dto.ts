import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserType } from '../enums/user-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import * as faker from 'faker';

export class CreateUserDto {
  @ApiProperty({
    description: 'User name',
    example: faker.name.firstName(),
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name should not be empty' })
  readonly name: string;

  @ApiProperty({
    description: 'User surname',
    example: faker.name.lastName(),
  })
  @IsString({ message: 'Surname must be a string' })
  @IsNotEmpty({ message: 'Surname should not be empty' })
  readonly surname: string;

  @ApiProperty({
    description: 'User email',
    example: faker.internet.email(),
  })
  @IsEmail({ message: 'Email must be a email' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  readonly email: string;

  @ApiProperty({
    description: 'User type',
    enum: UserType,
    example: UserType.ADMIN,
  })
  @IsEnum(Object.values(UserType), {
    message: "Type must be a valid user type: 'admin' or 'user'",
  })
  @IsNotEmpty({ message: 'Type should not be empty' })
  readonly type: UserType;

  @ApiProperty({
    description: 'User password',
    example: faker.internet.password(),
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password should not be empty' })
  readonly password: string;
}
