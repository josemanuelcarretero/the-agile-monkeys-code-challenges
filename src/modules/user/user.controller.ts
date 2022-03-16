import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  GetUserIdDto,
  UpdateUserDto,
  UserFiltersDto,
  UserOrderDto,
} from './dtos';
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
import { PaginationDto } from '../common/dtos/pagination.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('v1/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(UserTypeGuard(UserType.ADMIN))
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get all users with pagination and filters',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    type: GetUserListResponse,
  })
  async getUserList(
    @Query() order: UserOrderDto,
    @Query() pagination: PaginationDto,
    @Query() search: UserFiltersDto,
  ) {
    const { count, items } = await this.userService.findAndCount({
      order,
      pagination,
      search,
    });
    return new GetUserListResponse(items, count, pagination, order);
  }

  @Get(':id')
  @UseGuards(UserTypeGuard(UserType.ADMIN))
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get user by id',
  })
  @ApiResponse({
    type: GetUserByIdResponse,
  })
  async getUserById(@Param() { id }: GetUserIdDto) {
    return new GetUserByIdResponse(await this.userService.findById(id));
  }

  @Post()
  @UseGuards(UserTypeGuard(UserType.ADMIN))
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create new user',
  })
  @HttpCode(201)
  @ApiResponse({
    type: CreateUserResponse,
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return new CreateUserResponse(await this.userService.create(createUserDto));
  }

  @Put(':id')
  @UseGuards(UserTypeGuard(UserType.ADMIN))
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update user by id',
  })
  @ApiResponse({
    type: UpdateUserResponse,
  })
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete user by id',
  })
  @ApiResponse({
    type: DeleteUserResponse,
  })
  async deleteById(@Param() { id }: GetUserIdDto) {
    return new DeleteUserResponse(await this.userService.deleteById(id));
  }
}
