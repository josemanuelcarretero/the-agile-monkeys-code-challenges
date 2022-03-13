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
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return new CreateCustomerResponse(
      await this.customerService.create(createCustomerDto),
    );
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateCustomer(
    @Param() { id }: GetCustomerIdDto,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return new UpdateCustomerResponse(
      await this.customerService.update(id, updateCustomerDto),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteById(@Param() { id }: GetCustomerIdDto) {
    return new DeleteCustomerResponse(
      await this.customerService.deleteById(id),
    );
  }
}
