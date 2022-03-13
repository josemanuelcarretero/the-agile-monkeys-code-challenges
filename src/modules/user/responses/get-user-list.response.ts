import { User } from '../models/user.model';
import { UserDto, UserOrderDto } from '../dtos';
import { PaginationDto } from '../../common/dtos/pagination.dto';
import { SuccessWithPaginationResponse } from '../../common/responses/success-with-pagination.response';

export class GetUserListResponse extends SuccessWithPaginationResponse<
  UserDto[]
> {
  constructor(
    users: User[],
    total: number,
    paginationInfo: PaginationDto,
    orderInfo: UserOrderDto,
  ) {
    super(
      'User list successfully retrieved',
      users.map(UserDto.create),
      {
        offset: paginationInfo.offset,
        limit: paginationInfo.limit,
        total: total,
        length: users.length,
      },
      {
        order: orderInfo.order,
        dir: orderInfo.dir,
      },
    );
  }
}
