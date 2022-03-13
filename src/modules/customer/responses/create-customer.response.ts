import { Customer } from '../models/customer.model';
import { CustomerDto } from '../dtos';
import { SuccessResponse } from '../../common/responses/success.response';

export class CreateCustomerResponse extends SuccessResponse<CustomerDto> {
  constructor(customer: Customer) {
    super('Customer successfully created', CustomerDto.create(customer));
  }
}
