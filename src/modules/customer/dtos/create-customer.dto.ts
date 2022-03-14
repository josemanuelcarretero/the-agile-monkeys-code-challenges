import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import * as faker from 'faker';
import { v4 as uuid } from 'uuid';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Customer name',
    example: faker.name.firstName(),
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name should not be empty' })
  readonly name: string;

  @ApiProperty({
    description: 'Customer surname',
    example: faker.name.lastName(),
  })
  @IsString({ message: 'Surname must be a string' })
  @IsNotEmpty({ message: 'Surname should not be empty' })
  readonly surname: string;

  @ApiProperty({
    description: 'Customer external id',
    example: uuid(),
  })
  @IsString({ message: 'External id must be a string' })
  @IsNotEmpty({ message: 'External id should not be empty' })
  readonly external_id: string;

  @ApiProperty({
    description: 'Customer image',
    example: faker.image.avatar(),
    required: false,
  })
  @IsString({ message: 'Image must be a string' })
  @IsOptional()
  readonly image: string;
}
