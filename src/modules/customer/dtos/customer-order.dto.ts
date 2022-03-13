import { IsEnum } from 'class-validator';
import { OrderDto } from '../../common/dtos/order.dto';

enum OrderField {
  id = 'id',
  external_id = 'external_id',
  name = 'name',
  surname = 'surname',
  created_at = 'created_at',
  updated_at = 'updated_at',
}

export class CustomerOrderDto extends OrderDto {
  @IsEnum(Object.values(OrderField), { message: 'Invalid order field' })
  readonly order: string = OrderField.created_at;
}
