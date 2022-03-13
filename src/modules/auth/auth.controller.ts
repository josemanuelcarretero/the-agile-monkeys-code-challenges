import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos';
import { LoginResponse } from './responses';
import { UserService } from '../user/user.service';
import { HelperService } from '../helpers/helpers.service';
import { PasswordDoesNotMatchException } from './exceptions/password-does-not-match.exception';

@Controller('v1/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private helperService: HelperService,
  ) {}

  @Post('in')
  async login(@Body() loginDTO: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDTO;
    const user = await this.userService.findByEmail(email);

    const valid = await this.helperService.matchPassword(
      user.password,
      password,
    );
    if (!valid) {
      throw new PasswordDoesNotMatchException();
    }

    return new LoginResponse(
      user,
      await this.authService.generateAccessToken(user),
    );
  }
}