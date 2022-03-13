import { CustomerDto } from '../dtos';
import { SuccessResponse } from '../../common/responses/success.response';
import { Customer } from '../models/customer.model';

export class GetCustomerByIdResponse extends SuccessResponse<CustomerDto> {
  constructor(customer: Customer) {
    super('Customer successfully retrieved', CustomerDto.create(customer));
  }
}
