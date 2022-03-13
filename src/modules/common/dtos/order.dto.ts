import { IsOptional, IsEnum, IsString } from 'class-validator';

enum OrderDirection {
  asc = 'ASC',
  desc = 'DESC',
}

export class OrderDto {
  @IsEnum(Object.values(OrderDirection), { message: 'Invalid order direction' })
  readonly dir: OrderDirection = OrderDirection.asc;

  @IsOptional()
  @IsString({ message: 'Invalid order field' })
  readonly order: string;
}
