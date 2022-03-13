import { SuccessResponse } from './success.response';
import { OuputPaginationDto } from '../dtos/ouput-pagination.dto';
import { OrderDto } from '../dtos/order.dto';

export class SuccessWithPaginationResponse<T> extends SuccessResponse<T> {
  pagination: OuputPaginationDto;
  order: OrderDto;

  constructor(
    message: string,
    data: T,
    pagination: OuputPaginationDto,
    order: OrderDto,
  ) {
    super(message, data);
    this.pagination = pagination;
    this.order = order;
  }
}
