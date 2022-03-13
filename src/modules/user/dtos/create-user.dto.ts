import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserType } from '../enums/user-type.enum';

export class CreateUserDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name should not be empty' })
  readonly name: string;

  @IsString({ message: 'Surname must be a string' })
  @IsNotEmpty({ message: 'Surname should not be empty' })
  readonly surname: string;

  @IsEmail({ message: 'Email must be a email' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  readonly email: string;

  @IsEnum(Object.values(UserType), {
    message: "Type must be a valid user type: 'admin' or 'user'",
  })
  @IsNotEmpty({ message: 'Type should not be empty' })
  readonly type: UserType;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password should not be empty' })
  readonly password: string;
}
