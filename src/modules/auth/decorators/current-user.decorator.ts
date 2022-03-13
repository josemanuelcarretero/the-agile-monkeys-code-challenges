import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../user/models/user.model';
import RequestWithUser from '../requests/request-with-user.request';
import { NotAuthenticatedException } from '../exceptions/not-authenticated.exception';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): Partial<User> => {
    try {
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      return request.user;
    } catch (error) {
      throw new NotAuthenticatedException();
    }
  },
);
