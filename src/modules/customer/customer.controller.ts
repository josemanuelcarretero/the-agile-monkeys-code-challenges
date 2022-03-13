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
  GetCustomerIdDto,
  UpdateCustomerDto,
  CustomerOrderDto,
  CustomerFiltersDto,
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

@Controller('v1/customers')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  async getCustomerById(@Param() { id }: GetCustomerIdDto) {
    return new GetCustomerByIdResponse(await this.customerService.findById(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async createCustomer(
    @CurrentUser() user,
    @Body() createCustomerDto: CreateCustomerDto,
  ) {
    return new CreateCustomerResponse(
      await this.customerService.create(createCustomerDto, user),
    );
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  async deleteById(@CurrentUser() user, @Param() { id }: GetCustomerIdDto) {
    return new DeleteCustomerResponse(
      await this.customerService.deleteById(id, user),
    );
  }
}
