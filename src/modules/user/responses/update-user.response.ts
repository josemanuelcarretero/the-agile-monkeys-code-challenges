import { User } from '../models/user.model';
import { UserDto } from '../dtos';
import { SuccessResponse } from '../../common/responses/success.response';

export class UpdateUserResponse extends SuccessResponse<UserDto> {
  constructor(user: User) {
    super('User successfully updated', UserDto.create(user));
  }
}
