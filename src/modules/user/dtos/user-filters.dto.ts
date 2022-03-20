import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '../enums/user-type.enum';

export class UserFiltersDto {
  @ApiProperty({
    description: 'Filter by user id',
    required: false,
  })
  @IsOptional()
  @IsUUID(null, { message: 'Id must be a uuid' })
  readonly filter_id?: string;

  @ApiProperty({
    description: 'Filter by user name',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  readonly filter_name?: string;

  @ApiProperty({
    description: 'Filter by user surname',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Surname must be a string' })
  readonly filter_surname?: string;

  @ApiProperty({
    description: 'Filter by user email',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email' })
  readonly filter_email?: string;

  @ApiProperty({
    description: 'Filter by user creation date',
    required: false,
    enum: UserType,
  })
  @IsOptional()
  @IsEnum(UserType, { message: 'User type must be a valid type' })
  readonly filter_type?: UserType;

  @ApiProperty({
    description: 'Filter by user creation date',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Created at must be a date' })
  readonly filter_created_at: string;

  @ApiProperty({
    description: 'Filter by user updating date',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Updated at must be a date' })
  readonly filter_updated_at: string;

  @ApiProperty({
    description: 'Filter from user creation date',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Created at[from] must be a date' })
  readonly filter_created_at_from?: Date;

  @ApiProperty({
    description: 'Filter to user creation date',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Created at[to] must be a date' })
  readonly filter_created_at_to?: Date;

  @ApiProperty({
    description: 'Filter from user updating date',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Updated at[from] must be a date' })
  readonly filter_updated_at_from?: Date;

  @ApiProperty({
    description: 'Filter to user updating date',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Updated at[to] must be a date' })
  readonly filter_updated_at_to?: Date;

  @ApiProperty({
    description: 'Search string in multiple fields',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Query must be a string' })
  readonly query?: string;
}
