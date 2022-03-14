import { SuccessResponse } from '../../common/responses/success.response';

export class DeleteCustomerResponse extends SuccessResponse<boolean>(
  Boolean,
  'Customer successfully deleted',
) {
  constructor(data: boolean) {
    super(data);
  }
}
