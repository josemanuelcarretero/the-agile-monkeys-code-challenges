import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, GetUserIdDto, UpdateUserDto } from './dtos';
import {
  CreateUserResponse,
  DeleteUserResponse,
  GetUserByIdResponse,
  GetUserListResponse,
  UpdateUserResponse,
} from './responses';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import UserTypeGuard from '../auth/guards/user-type.guard';
import { UserType } from './enums/user-type.enum';

@Controller('v1/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserList() {
    const users = await this.userService.findAll();
    return new GetUserListResponse(users);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param() { id }: GetUserIdDto) {
    return new GetUserByIdResponse(await this.userService.findById(id));
  }

  @Post()
  @UseGuards(UserTypeGuard(UserType.ADMIN))
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return new CreateUserResponse(await this.userService.create(createUserDto));
  }

  @Put(':id')
  @UseGuards(UserTypeGuard(UserType.ADMIN))
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param() { id }: GetUserIdDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return new UpdateUserResponse(
      await this.userService.update(id, updateUserDto),
    );
  }

  @Delete(':id')
  @UseGuards(UserTypeGuard(UserType.ADMIN))
  @UseGuards(JwtAuthGuard)
  async deleteById(@Param() { id }: GetUserIdDto) {
    return new DeleteUserResponse(await this.userService.deleteById(id));
  }
}
