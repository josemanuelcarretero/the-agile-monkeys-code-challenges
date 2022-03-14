import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'User email',
    example: 'admin@crm.josemanuelcarretero.me',
  })
  @IsEmail({ message: 'Email must be a email' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  readonly email: string;

  @ApiProperty({
    description: 'User password',
    example: 'admin',
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password should not be empty' })
  readonly password: string;
}
