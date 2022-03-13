import { Inject, Injectable } from '@nestjs/common';

import { Customer } from './models/customer.model';
import { CreateCustomerDto, UpdateCustomerDto } from './dtos';
import { CustomerNotFoundException } from './exceptions/customer-not-found.exception';
import { CustomerAlreadyExistsException } from './exceptions/customer-already-exists.exception';
import { Repository } from 'typeorm';
import { HelperService } from '../helpers/helpers.service';

@Injectable()
export class CustomerService {
  constructor(
    @Inject('CustomerRepository')
    private readonly customerRepository: Repository<Customer>,
    private readonly helperService: HelperService,
  ) {}

  async findAll() {
    return await this.customerRepository.find({
      where: { deleted: false },
    });
  }

  async findById(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id, deleted: false },
    });
    if (!customer) {
      throw new CustomerNotFoundException();
    }
    return customer;
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    try {
      const insertResult = await this.customerRepository.insert({
        ...createCustomerDto,
      });
      return await this.customerRepository.findOne({
        where: { id: insertResult.identifiers[0].id },
      });
    } catch (e) {
      throw new CustomerAlreadyExistsException();
    }
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id, deleted: false },
    });
    if (!customer) {
      throw new CustomerNotFoundException();
    }
    if (
      updateCustomerDto.external_id &&
      updateCustomerDto.external_id !== customer.external_id
    ) {
      const customerExists = await this.customerRepository.findOne({
        where: { external_id: updateCustomerDto.external_id, deleted: false },
      });
      if (customerExists) {
        throw new CustomerAlreadyExistsException();
      }
    }
    return await this.customerRepository.save({
      ...customer,
      ...updateCustomerDto,
    });
  }

  async deleteById(id: string): Promise<boolean> {
    const customer = await this.customerRepository.findOne({
      where: { id, deleted: false },
    });
    if (!customer) {
      throw new CustomerNotFoundException();
    }
    const savedCustomer = await this.customerRepository.save({
      ...customer,
      name: `Removed Customer`,
      surname: '',
      external_id: await this.helperService.obfuscateExternalId(
        customer.external_id,
      ),
      deleted: true,
      deleted_at: new Date(),
    });
    return savedCustomer?.deleted ?? false;
  }
}
