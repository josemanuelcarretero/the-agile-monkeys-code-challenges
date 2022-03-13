import { User } from '../../user/models/user.model';
import { AccessTokenDto, UserWithAccessTokenDto } from '../dtos';
import { SuccessResponse } from '../../common/responses/success.response';

export class LoginResponse extends SuccessResponse<UserWithAccessTokenDto> {
  constructor(user: User, accessToken: AccessTokenDto) {
    super(
      'Login successfully',
      UserWithAccessTokenDto.create({
        ...user,
        ...accessToken,
      }),
    );
  }
}
