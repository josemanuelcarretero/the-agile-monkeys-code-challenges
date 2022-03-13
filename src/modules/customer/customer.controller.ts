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
import { CustomerService } from './customer.service';
import { CreateCustomerDto, GetCustomerIdDto, UpdateCustomerDto } from './dtos';
import {
  CreateCustomerResponse,
  DeleteCustomerResponse,
  GetCustomerByIdResponse,
  GetCustomerListResponse,
  UpdateCustomerResponse,
} from './responses';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('v1/customers')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getCustomerList() {
    const customers = await this.customerService.findAll();
    return new GetCustomerListResponse(customers);
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
