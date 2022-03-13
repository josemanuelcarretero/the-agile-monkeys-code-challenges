import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCustomerDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name should not be empty' })
  readonly name: string;

  @IsString({ message: 'Surname must be a string' })
  @IsNotEmpty({ message: 'Surname should not be empty' })
  readonly surname: string;

  @IsString({ message: 'External id must be a string' })
  @IsNotEmpty({ message: 'External id should not be empty' })
  readonly external_id: string;

  @IsString({ message: 'Image must be a string' })
  @IsOptional()
  readonly image: string;
}
