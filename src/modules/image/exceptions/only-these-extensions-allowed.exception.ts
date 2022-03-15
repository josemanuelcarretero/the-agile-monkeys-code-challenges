import { BadRequestException } from '@nestjs/common';

export class OnlyTheseExtensionsAllowedException extends BadRequestException {
  constructor(extensionsAllowed: string[]) {
    super(`Only these extensions are allowed: ${extensionsAllowed.join(', ')}`);
  }
}
