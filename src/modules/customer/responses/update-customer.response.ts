import { CustomerDto } from '../dtos';
import { SuccessResponse } from '../../common/responses/success.response';
import { Customer } from '../models/customer.model';

export class UpdateCustomerResponse extends SuccessResponse<CustomerDto> {
  constructor(data: Customer) {
    super('Customer successfully updated', CustomerDto.create(data));
  }
}
