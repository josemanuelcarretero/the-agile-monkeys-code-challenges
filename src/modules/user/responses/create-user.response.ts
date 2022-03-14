import { User } from '../models/user.model';
import { UserDto } from '../dtos';
import { SuccessResponse } from '../../common/responses/success.response';

export class CreateUserResponse extends SuccessResponse<UserDto>(
  UserDto,
  'User successfully created',
) {
  constructor(user: User) {
    super(UserDto.create(user));
  }
}
