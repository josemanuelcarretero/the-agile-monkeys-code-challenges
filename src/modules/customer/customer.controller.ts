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
import { CustomerService } from './customer.service';
import { CreateCustomerDto, GetCustomerIdDto, UpdateCustomerDto } from './dtos';
import {
  CreateCustomerResponse,
  DeleteCustomerResponse,
  GetCustomerByIdResponse,
  GetCustomerListResponse,
  UpdateCustomerResponse,
} from './responses';

@Controller('v1/customers')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Get()
  async getCustomerList() {
    const customers = await this.customerService.findAll();
    return new GetCustomerListResponse(customers);
  }

  @Get(':id')
  async getCustomerById(@Param() { id }: GetCustomerIdDto) {
    return new GetCustomerByIdResponse(await this.customerService.findById(id));
  }

  @Post()
  @HttpCode(201)
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return new CreateCustomerResponse(
      await this.customerService.create(createCustomerDto),
    );
  }

  @Put(':id')
  async updateCustomer(
    @Param() { id }: GetCustomerIdDto,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return new UpdateCustomerResponse(
      await this.customerService.update(id, updateCustomerDto),
    );
  }

  @Delete(':id')
  async deleteById(@Param() { id }: GetCustomerIdDto) {
    return new DeleteCustomerResponse(
      await this.customerService.deleteById(id),
    );
  }
}
