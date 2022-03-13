import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

export const getStatus = (exception: unknown): number => {
  return exception instanceof HttpException
    ? exception.getStatus()
    : HttpStatus.INTERNAL_SERVER_ERROR;
};

export const getErrorMessage = (exception: unknown): string => {
  return exception instanceof HttpException
    ? getErrorMessageFromHttpException(exception)
    : String(exception);
};

export const getCode = (exception: unknown): string => {
  return (
    getErrorMessage(exception)
      // Remove phrase before the first double dot
      .replace(/(.*)(:.*)+/, '$1')
      // Capitalize first letter of each word
      .toLowerCase()
      .replace(/(^\w)|(\s\w)/g, (match) => match.toUpperCase())
      // Remove spaces
      .replace(/ /g, '')
      // Remove special characters
      .replace(/[^a-zA-Z0-9]/g, '') + 'Error'
  );
};

export const getErrorMessageFromHttpException = (
  exception: HttpException,
): string => {
  return String(
    typeof exception.getResponse()['message'] === 'string'
      ? exception.getResponse()['message']
      : exception.getResponse()['message'][0],
  );
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const status = getStatus(exception);
    const code = getCode(exception);
    const error = getErrorMessage(exception);

    response.status(status).send({
      success: false,
      status,
      error,
      code,
    });
  }
}
