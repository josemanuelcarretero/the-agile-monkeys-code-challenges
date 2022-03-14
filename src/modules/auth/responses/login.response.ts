import { User } from '../../user/models/user.model';
import { AccessTokenDto, UserWithAccessTokenDto } from '../dtos';
import { SuccessResponse } from '../../common/responses/success.response';

export class LoginResponse extends SuccessResponse<UserWithAccessTokenDto>(
  UserWithAccessTokenDto,
  'Login successfully',
) {
  constructor(user: User, accessToken: AccessTokenDto) {
    super(
      UserWithAccessTokenDto.create({
        ...user,
        ...accessToken,
      }),
    );
  }
}
