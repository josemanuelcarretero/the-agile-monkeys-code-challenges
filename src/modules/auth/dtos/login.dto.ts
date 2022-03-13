import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({ message: 'Email must be a email' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  readonly email: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password should not be empty' })
  readonly password: string;
}
