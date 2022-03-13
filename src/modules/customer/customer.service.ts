import { Inject, Injectable } from '@nestjs/common';

import { Customer } from './models/customer.model';
import { CreateCustomerDto, UpdateCustomerDto } from './dtos';
import { CustomerNotFoundException } from './exceptions/customer-not-found.exception';
import { CustomerAlreadyExistsException } from './exceptions/customer-already-exists.exception';
import { Repository } from 'typeorm';
import { User } from '../user/models/user.model';
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
      relations: ['created_by', 'updated_by'],
    });
    if (!customer) {
      throw new CustomerNotFoundException();
    }
    return customer;
  }

  async create(
    createCustomerDto: CreateCustomerDto,
    createdBy: User,
  ): Promise<Customer> {
    try {
      const insertResult = await this.customerRepository.insert({
        ...createCustomerDto,
        created_by: createdBy,
        updated_by: createdBy,
      });
      return await this.customerRepository.findOne({
        where: { id: insertResult.identifiers[0].id },
        relations: ['created_by', 'updated_by'],
      });
    } catch (e) {
      throw new CustomerAlreadyExistsException();
    }
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
    updatedBy: User,
  ): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id, deleted: false },
      relations: ['created_by', 'updated_by'],
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
      updated_by: updatedBy,
    });
  }

  async deleteById(id: string, deletedBy: User): Promise<boolean> {
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
      deleted_by: deletedBy,
    });
    return savedCustomer?.deleted ?? false;
  }
}
