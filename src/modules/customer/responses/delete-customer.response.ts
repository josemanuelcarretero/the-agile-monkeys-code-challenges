import { SuccessResponse } from '../../common/responses/success.response';

export class DeleteCustomerResponse extends SuccessResponse<boolean> {
  constructor(data: boolean) {
    super('Customer successfully deleted', data);
  }
}
