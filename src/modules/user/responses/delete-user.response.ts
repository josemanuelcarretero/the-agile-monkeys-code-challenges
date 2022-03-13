import { SuccessResponse } from '../../common/responses/success.response';

export class DeleteUserResponse extends SuccessResponse<boolean> {
  constructor(data: boolean) {
    super('User successfully deleted', data);
  }
}
