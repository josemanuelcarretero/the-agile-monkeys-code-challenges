import { UnauthorizedException } from '@nestjs/common';

export class NotAuthenticatedException extends UnauthorizedException {
  constructor() {
    super('Not authenticated');
  }
}
