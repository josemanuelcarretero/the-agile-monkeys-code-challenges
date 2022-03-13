import { IsOptional, IsString, IsDate, IsUUID, IsEmail } from 'class-validator';

export class CustomerFiltersDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  readonly filter_name?: string;

  @IsOptional()
  @IsString({ message: 'Surname must be a string' })
  readonly filter_surname?: string;

  @IsOptional()
  @IsString({ message: 'External id must be a string' })
  readonly filter_external_id?: string;

  @IsOptional()
  @IsUUID('all', { message: 'Created by must be a uuid' })
  readonly filter_created_by?: string;

  @IsOptional()
  @IsUUID('all', { message: 'Updated by must be a uuid' })
  readonly filter_updated_by?: string;

  @IsOptional()
  @IsEmail({ message: 'Created by[email] must be a valid email' })
  readonly filter_created_by_email?: string;

  @IsOptional()
  @IsEmail({ message: 'Updated by[email] must be a valid email' })
  readonly filter_updated_by_email?: string;

  @IsOptional()
  @IsString({ message: 'Created at must be a date' })
  readonly filter_created_at: string;

  @IsOptional()
  @IsString({ message: 'Updated at must be a date' })
  readonly filter_updated_at: string;

  @IsOptional()
  @IsDate({ message: 'Created at[from] must be a date' })
  readonly filter_created_at_from?: Date;

  @IsOptional()
  @IsDate({ message: 'Created at[to] must be a date' })
  readonly filter_created_at_to?: Date;

  @IsOptional()
  @IsDate({ message: 'Updated at[from] must be a date' })
  readonly filter_updated_at_from?: Date;

  @IsOptional()
  @IsDate({ message: 'Updated at[to] must be a date' })
  readonly filter_updated_at_to?: Date;

  @IsOptional()
  @IsString({ message: 'Query must be a string' })
  readonly query?: string;
}
