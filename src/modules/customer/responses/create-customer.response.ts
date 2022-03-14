import { Customer } from '../models/customer.model';
import { CustomerDto } from '../dtos';
import { SuccessResponse } from '../../common/responses/success.response';

export class CreateCustomerResponse extends SuccessResponse<CustomerDto>(
  CustomerDto,
  'Customer successfully created',
) {
  constructor(customer: Customer) {
    super(CustomerDto.create(customer));
  }
}
