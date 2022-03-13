import { Customer } from '../models/customer.model';
import { CustomerDto, CustomerOrderDto } from '../dtos';
import { PaginationDto } from '../../common/dtos/pagination.dto';
import { SuccessWithPaginationResponse } from '../../common/responses/success-with-pagination.response';

export class GetCustomerListResponse extends SuccessWithPaginationResponse<
  CustomerDto[]
> {
  constructor(
    customers: Customer[],
    total: number,
    paginationInfo: PaginationDto,
    orderInfo: CustomerOrderDto,
  ) {
    console.log(customers);
    super(
      'Customer list successfully retrieved',
      customers.map(CustomerDto.create),
      {
        offset: paginationInfo.offset,
        limit: paginationInfo.limit,
        total: total,
        length: customers.length,
      },
      {
        order: orderInfo.order,
        dir: orderInfo.dir,
      },
    );
  }
}
