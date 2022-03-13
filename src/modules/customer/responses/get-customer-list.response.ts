import { CustomerDto } from '../dtos';
import { SuccessResponse } from '../../common/responses/success.response';

export class GetCustomerListResponse extends SuccessResponse<CustomerDto[]> {
  constructor(customers: CustomerDto[]) {
    super(
      'Customer list successfully retrieved',
      customers.map(CustomerDto.create),
    );
  }
}
