import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos';
import { LoginResponse } from './responses';
import { UserService } from '../user/user.service';
import { HelperService } from '../helpers/helpers.service';
import { PasswordDoesNotMatchException } from './exceptions/password-does-not-match.exception';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('v1/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private helperService: HelperService,
  ) {}

  @Post('in')
  @ApiOperation({
    summary: 'Start session with email and password to get access token',
  })
  @ApiResponse({
    type: LoginResponse,
  })
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
