import { ApiProperty } from '@nestjs/swagger';

function buildCode(message: string): string {
  return (
    message
      .toLowerCase()
      // Capitalize first letter of each word
      .replace(/(^\w)|(\s\w)/g, (match) => match.toUpperCase())
      // Remove spaces
      .replace(/ /g, '')
      // Remove special characters
      .replace(/[^a-zA-Z0-9]/g, '') + 'Response'
  );
}

export function SuccessResponse<T>(
  dataSpecification: any,
  msg: string,
  isArray = false,
): any {
  const code: string = buildCode(msg);

  class SuccessResponseTemplate {
    @ApiProperty({
      description: 'Response success status',
      example: true,
    })
    success: boolean;

    @ApiProperty({
      description: 'Response message',
      example: msg,
    })
    message: string;

    @ApiProperty({
      description: 'Response identifier code',
      example: code,
    })
    code: string;

    @ApiProperty({
      description: 'Response data',
      type: dataSpecification,
      isArray,
    })
    data: T;

    constructor(data: T) {
      this.success = true;
      this.message = msg;
      this.code = code;
      this.data = data;
    }
  }

  return SuccessResponseTemplate;
}
