import { User } from '../models/user.model';
import { UserDto } from '../dtos';
import { SuccessResponse } from '../../common/responses/success.response';

export class CreateUserResponse extends SuccessResponse<UserDto> {
  constructor(user: User) {
    super('User successfully created', UserDto.create(user));
  }
}
