import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsOptional,
} from 'class-validator';
import { UserType } from '../enums/user-type.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name should not be empty' })
  readonly name: string;

  @IsOptional()
  @IsString({ message: 'Surname must be a string' })
  @IsNotEmpty({ message: 'Surname should not be empty' })
  readonly surname: string;

  @IsOptional()
  @IsEmail({ message: 'Email must be a email' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  readonly email: string;

  @IsOptional()
  @IsEnum(Object.values(UserType), {
    message: "Type must be a valid user type: 'admin' or 'user'",
  })
  @IsNotEmpty({ message: 'Type should not be empty' })
  readonly type: UserType;

  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password should not be empty' })
  readonly password: string;
}
