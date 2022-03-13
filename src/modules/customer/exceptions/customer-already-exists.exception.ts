import { ConflictException } from '@nestjs/common';

export class CustomerAlreadyExistsException extends ConflictException {
  constructor() {
    super(`Customer already exists`);
  }
}
