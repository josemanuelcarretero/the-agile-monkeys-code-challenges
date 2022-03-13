import { User } from '../models/user.model';
import { UserDto } from '../dtos';
import { SuccessResponse } from '../../common/responses/success.response';

export class GetUserListResponse extends SuccessResponse<UserDto[]> {
  constructor(users: User[]) {
    super('User list successfully retrieved', users.map(UserDto.create));
  }
}
