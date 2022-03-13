import { ConflictException } from '@nestjs/common';

export class PasswordDoesNotMatchException extends ConflictException {
  constructor() {
    super('Password does not match');
  }
}
