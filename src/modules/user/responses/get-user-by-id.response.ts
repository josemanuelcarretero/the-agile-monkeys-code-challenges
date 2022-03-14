import { User } from '../models/user.model';
import { UserDto } from '../dtos';
import { SuccessResponse } from '../../common/responses/success.response';

export class GetUserByIdResponse extends SuccessResponse<UserDto>(
  UserDto,
  'User successfully retrieved',
) {
  constructor(user: User) {
    super(UserDto.create(user));
  }
}
