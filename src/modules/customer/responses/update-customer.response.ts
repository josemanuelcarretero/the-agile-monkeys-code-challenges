import { Customer } from '../models/customer.model';
import { CustomerDto } from '../dtos';
import { SuccessResponse } from '../../common/responses/success.response';

export class UpdateCustomerResponse extends SuccessResponse<CustomerDto>(
  CustomerDto,
  'Customer successfully updated',
) {
  constructor(customer: Customer) {
    super(CustomerDto.create(customer));
  }
}
