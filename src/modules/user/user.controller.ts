import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
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

@Controller('v1/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUserList() {
    const users = await this.userService.findAll();
    return new GetUserListResponse(users);
  }

  @Get(':id')
  async getUserById(@Param() { id }: GetUserIdDto) {
    return new GetUserByIdResponse(await this.userService.findById(id));
  }

  @Post()
  @HttpCode(201)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return new CreateUserResponse(await this.userService.create(createUserDto));
  }

  @Put(':id')
  async updateUser(
    @Param() { id }: GetUserIdDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return new UpdateUserResponse(
      await this.userService.update(id, updateUserDto),
    );
  }

  @Delete(':id')
  async deleteById(@Param() { id }: GetUserIdDto) {
    return new DeleteUserResponse(await this.userService.deleteById(id));
  }
}
