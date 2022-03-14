import { SuccessResponse } from '../../common/responses/success.response';

export class DeleteUserResponse extends SuccessResponse<boolean>(
  Boolean,
  'User successfully deleted',
) {
  constructor(data: boolean) {
    super(data);
  }
}
