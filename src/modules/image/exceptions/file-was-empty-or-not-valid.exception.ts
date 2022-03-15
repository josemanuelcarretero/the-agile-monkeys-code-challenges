import { BadRequestException } from '@nestjs/common';

export class FileWasEmptyOrNotValidException extends BadRequestException {
  constructor() {
    super('File was empty or not valid');
  }
}
