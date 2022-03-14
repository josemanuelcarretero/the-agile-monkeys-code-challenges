import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum OrderDirection {
  asc = 'ASC',
  desc = 'DESC',
}

export class OrderDto {
  @ApiProperty({
    description: 'Direction to sort the results',
    enum: OrderDirection,
    required: false,
  })
  @IsEnum(Object.values(OrderDirection), { message: 'Invalid order direction' })
  readonly dir: OrderDirection = OrderDirection.asc;

  @ApiProperty({
    description: 'Field to order the results',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Invalid order field' })
  readonly order: string;
}
