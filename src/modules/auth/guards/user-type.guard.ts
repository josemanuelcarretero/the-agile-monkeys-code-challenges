import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import RequestWithUser from '../requests/request-with-user.request';
import { UserType } from '../../user/enums/user-type.enum';
import { NotAllowedForThisTypeOfUserException } from '../exceptions/not-allowed-for-this-type-of-user';

const UserTypeGuard = (type: UserType): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;

      if (user.type !== type) {
        throw new NotAllowedForThisTypeOfUserException();
      }

      return true;
    }
  }

  return mixin(RoleGuardMixin);
};

export default UserTypeGuard;
