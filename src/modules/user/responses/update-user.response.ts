import { User } from '../models/user.model';
import { UserDto } from '../dtos';
import { SuccessResponse } from '../../common/responses/success.response';

export class UpdateUserResponse extends SuccessResponse<UserDto>(
  UserDto,
  'User successfully updated',
) {
  constructor(user: User) {
    super(UserDto.create(user));
  }
}
