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
import { CustomerService } from './customer.service';
import {
  CreateCustomerDto,
  CustomerFiltersDto,
  CustomerOrderDto,
  GetCustomerIdDto,
  UpdateCustomerDto,
} from './dtos';
import {
  CreateCustomerResponse,
  DeleteCustomerResponse,
  GetCustomerByIdResponse,
  GetCustomerListResponse,
  UpdateCustomerResponse,
} from './responses';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PaginationDto } from '../common/dtos/pagination.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Customers')
@Controller('v1/customers')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all customer with pagination and filters',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    type: GetCustomerListResponse,
  })
  async getCustomerList(
    @Query() order: CustomerOrderDto,
    @Query() pagination: PaginationDto,
    @Query() search: CustomerFiltersDto,
  ) {
    const { count, items } = await this.customerService.findAndCount({
      order,
      pagination,
      search,
    });
    return new GetCustomerListResponse(items, count, pagination, order);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get customer by id',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    type: GetCustomerByIdResponse,
  })
  async getCustomerById(@Param() { id }: GetCustomerIdDto) {
    return new GetCustomerByIdResponse(await this.customerService.findById(id));
  }

  @Post()
  @ApiOperation({
    summary: 'Create new customer',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(201)
  @ApiResponse({
    type: CreateCustomerResponse,
  })
  async createCustomer(
    @CurrentUser() user,
    @Body() createCustomerDto: CreateCustomerDto,
  ) {
    return new CreateCustomerResponse(
      await this.customerService.create(createCustomerDto, user),
    );
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update customer by id',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    type: UpdateCustomerResponse,
  })
  async updateCustomer(
    @CurrentUser() user,
    @Param() { id }: GetCustomerIdDto,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return new UpdateCustomerResponse(
      await this.customerService.update(id, updateCustomerDto, user),
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete customer by id',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    type: DeleteCustomerResponse,
  })
  async deleteById(@CurrentUser() user, @Param() { id }: GetCustomerIdDto) {
    return new DeleteCustomerResponse(
      await this.customerService.deleteById(id, user),
    );
  }
}
