import { SuccessResponse } from './success.response';
import { OutputPaginationDto } from '../dtos/output-pagination.dto';
import { OrderDto } from '../dtos/order.dto';
import { ApiProperty } from '@nestjs/swagger';

export function SuccessWithPaginationResponse<T>(
  dataSpecification: any,
  msg: string,
  orderSpecification?: typeof OrderDto,
): any {
  class SuccessWithPaginationResponseTemplate extends SuccessResponse<T>(
    dataSpecification,
    msg,
    true,
  ) {
    @ApiProperty({
      description: 'Pagination used in the response',
      type: OutputPaginationDto,
    })
    pagination: OutputPaginationDto;
    @ApiProperty({
      description: 'Order used in the response',
      type: orderSpecification || OrderDto,
    })
    order: OrderDto;

    constructor(data: T, pagination: OutputPaginationDto, order: OrderDto) {
      super(data);
      this.pagination = pagination;
      this.order = order;
    }
  }

  return SuccessWithPaginationResponseTemplate;
}
