import { IsDate, IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CustomerFiltersDto {
  @ApiProperty({
    description: 'Filter by customer name',

    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  readonly filter_name?: string;

  @ApiProperty({
    description: 'Filter by customer surname',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Surname must be a string' })
  readonly filter_surname?: string;

  @ApiProperty({
    description: 'Filter by customer external id',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'External id must be a string' })
  readonly filter_external_id?: string;

  @ApiProperty({
    description: 'Filter by user uuid who created the customer',
    required: false,
  })
  @IsOptional()
  @IsUUID('all', { message: 'Created by must be a uuid' })
  readonly filter_created_by?: string;

  @ApiProperty({
    description: 'Filter by user uuid who updated the customer',
    required: false,
  })
  @IsOptional()
  @IsUUID('all', { message: 'Updated by must be a uuid' })
  readonly filter_updated_by?: string;

  @ApiProperty({
    description: 'Filter by user email who created the customer',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Created by[email] must be a valid email' })
  readonly filter_created_by_email?: string;

  @ApiProperty({
    description: 'Filter by user email who updated the customer',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Updated by[email] must be a valid email' })
  readonly filter_updated_by_email?: string;

  @ApiProperty({
    description: 'Filter by customer creation date',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Created at must be a date' })
  readonly filter_created_at: string;

  @ApiProperty({
    description: 'Filter by customer updating date',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Updated at must be a date' })
  readonly filter_updated_at: string;

  @ApiProperty({
    description: 'Filter from customer creation date',
    required: false,
  })
  @IsOptional()
  @IsDate({ message: 'Created at[from] must be a date' })
  readonly filter_created_at_from?: Date;

  @ApiProperty({
    description: 'Filter to customer creation date',
    required: false,
  })
  @IsOptional()
  @IsDate({ message: 'Created at[to] must be a date' })
  readonly filter_created_at_to?: Date;

  @ApiProperty({
    description: 'Filter from customer updating date',
    required: false,
  })
  @IsOptional()
  @IsDate({ message: 'Updated at[from] must be a date' })
  readonly filter_updated_at_from?: Date;

  @ApiProperty({
    description: 'Filter to customer updating date',
    required: false,
  })
  @IsOptional()
  @IsDate({ message: 'Updated at[to] must be a date' })
  readonly filter_updated_at_to?: Date;

  @ApiProperty({
    description: 'Search string in multiple fields',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Query must be a string' })
  readonly query?: string;
}
