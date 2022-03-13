import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JsonWebTokenError } from 'jsonwebtoken';
import { NotAuthenticatedException } from '../exceptions/not-authenticated.exception';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    if (info instanceof JsonWebTokenError) {
      throw new NotAuthenticatedException();
    }
    if (info instanceof Error && info.message === 'No auth token') {
      throw new NotAuthenticatedException();
    }

    return super.handleRequest(err, user, info, context, status);
  }
}
