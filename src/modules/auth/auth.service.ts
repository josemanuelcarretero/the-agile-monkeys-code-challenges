import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserSignedDto } from './dtos';
import { User } from '../user/models/user.model';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generateAccessToken(user: User) {
    const payload: UserSignedDto = {
      id: user.id,
      email: user.email,
      type: user.type,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
