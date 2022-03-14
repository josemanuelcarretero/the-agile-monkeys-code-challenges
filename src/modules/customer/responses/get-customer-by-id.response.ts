import { Customer } from '../models/customer.model';
import { CustomerDto } from '../dtos';
import { SuccessResponse } from '../../common/responses/success.response';

export class GetCustomerByIdResponse extends SuccessResponse<CustomerDto>(
  CustomerDto,
  'Customer successfully retrieved',
) {
  constructor(customer: Customer) {
    super(CustomerDto.create(customer));
  }
}
