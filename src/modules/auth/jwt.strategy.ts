import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';
import { AppConfig } from '../config/entities/app-config.entity';
import { User } from '../user/models/user.model';
import { UserSignedDto } from './dtos';
import { NotAuthenticatedException } from './exceptions/not-authenticated.exception';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    @Inject('AppConfig') private appConfig: AppConfig,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfig.jwt.secret,
    });
  }

  async validate(payload: UserSignedDto): Promise<User> {
    try {
      return await this.userService.findById(payload.id);
    } catch (error) {
      throw new NotAuthenticatedException();
    }
  }
}
