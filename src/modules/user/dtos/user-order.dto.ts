import { IsEnum } from 'class-validator';
import { OrderDto } from '../../common/dtos/order.dto';
import { ApiProperty } from '@nestjs/swagger';

enum OrderField {
  id = 'id',
  email = 'email',
  name = 'name',
  surname = 'surname',
  created_at = 'created_at',
  updated_at = 'updated_at',
}

export class UserOrderDto extends OrderDto {
  @ApiProperty({
    description: 'Field to order the results',
    required: false,
    enum: OrderField,
    default: OrderField.created_at,
  })
  @IsEnum(Object.values(OrderField), { message: 'Invalid order field' })
  readonly order: string = OrderField.created_at;
}
