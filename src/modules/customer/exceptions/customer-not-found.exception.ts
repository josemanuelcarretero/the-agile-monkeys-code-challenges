import { BadRequestException } from '@nestjs/common';

export class CustomerNotFoundException extends BadRequestException {
  constructor() {
    super(`Customer not found`);
  }
}
