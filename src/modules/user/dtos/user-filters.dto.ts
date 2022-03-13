import {
  IsOptional,
  IsString,
  IsDate,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { UserType } from '../enums/user-type.enum';

export class UserFiltersDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  readonly filter_name?: string;

  @IsOptional()
  @IsString({ message: 'Surname must be a string' })
  readonly filter_surname?: string;

  @IsOptional()
  @IsString({ message: 'Email must be a string' })
  readonly filter_email?: string;

  @IsOptional()
  @IsEnum(Object.values(UserType), {
    message: "Type must be a valid user type: 'admin' or 'user'",
  })
  readonly filter_type?: UserType;

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
