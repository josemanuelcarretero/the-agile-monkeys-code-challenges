import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuid } from 'uuid';

export class GetUserIdDto {
  @ApiProperty({
    description: 'Should be an id of a user that exists in the database',
    example: uuid(),
  })
  @IsUUID(null, { message: 'Id must be a uuid' })
  @IsNotEmpty({ message: 'Id must not be empty' })
  id: string;
}
