import { ForbiddenException } from '@nestjs/common';

export class NotAllowedForThisTypeOfUserException extends ForbiddenException {
  constructor() {
    super('Not allowed for this type of user');
  }
}
