import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetCustomerIdDto {
  @IsUUID(null, { message: 'Id must be a uuid' })
  @IsNotEmpty({ message: 'Id must not be empty' })
  id: string;
}
