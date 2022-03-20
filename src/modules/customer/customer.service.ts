import { Inject, Injectable } from '@nestjs/common';

import { Customer } from './models/customer.model';
import {
  CreateCustomerDto,
  CustomerFiltersDto,
  CustomerOrderDto,
  UpdateCustomerDto,
} from './dtos';
import { CustomerNotFoundException } from './exceptions/customer-not-found.exception';
import { CustomerAlreadyExistsException } from './exceptions/customer-already-exists.exception';
import { Repository } from 'typeorm';
import { User } from '../user/models/user.model';
import { HelperService } from '../helpers/helpers.service';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class CustomerService {
  constructor(
    @Inject('CustomerRepository')
    private readonly customerRepository: Repository<Customer>,
    private readonly helperService: HelperService,
  ) {}

  async findAndCount({
    search,
    order,
    pagination,
  }: {
    search: CustomerFiltersDto;
    order: CustomerOrderDto;
    pagination: PaginationDto;
  }) {
    const query = this.customerRepository
      .createQueryBuilder('customer')
      .innerJoinAndSelect('customer.created_by', 'created_by_user')
      .innerJoinAndSelect('customer.updated_by', 'updated_by_user');
    query.where('customer.deleted = false');

    if (search.query) {
      query.andWhere(
        'customer.id::text LIKE :query' +
          'OR customer.name LIKE :query' +
          ' OR customer.surname LIKE :query' +
          ' OR customer.external_id LIKE :query' +
          ' OR created_by_user.email LIKE :query' +
          ' OR updated_by_user.email LIKE :query',
        { query: `%${search.query}%` },
      );
    }

    if (search.filter_id) {
      query.andWhere('customer.id = :id', { id: search.filter_id });
    }

    if (search.filter_name) {
      query.andWhere('customer.name = :name', { name: search.filter_name });
    }

    if (search.filter_surname) {
      query.andWhere('customer.surname = :surname', {
        surname: search.filter_surname,
      });
    }

    if (search.filter_external_id) {
      query.andWhere('customer.external_id = :external_id', {
        external_id: search.filter_external_id,
      });
    }

    if (search.filter_created_at) {
      query.andWhere(
        "date_trunc('milliseconds', customer.created_at) = :created_at",
        {
          created_at: search.filter_created_at,
        },
      );
    }

    if (search.filter_updated_at) {
      query.andWhere(
        "date_trunc('milliseconds', customer.updated_at) = :updated_at",
        {
          updated_at: search.filter_updated_at,
        },
      );
    }

    if (search.filter_created_at_from) {
      query.andWhere(
        "date_trunc('milliseconds', customer.created_at) >= :created_at_from",
        {
          created_at_from: search.filter_created_at_from,
        },
      );
    }

    if (search.filter_created_at_to) {
      query.andWhere(
        "date_trunc('milliseconds', customer.created_at) <= :created_at_to",
        {
          created_at_to: search.filter_created_at_to,
        },
      );
    }

    if (search.filter_updated_at_from) {
      query.andWhere(
        "date_trunc('milliseconds', customer.updated_at) >= :updated_at_from",
        {
          updated_at_from: search.filter_updated_at_from,
        },
      );
    }

    if (search.filter_updated_at_to) {
      query.andWhere(
        "date_trunc('milliseconds', customer.updated_at) <= :updated_at_to",
        {
          updated_at_to: search.filter_updated_at_to,
        },
      );
    }

    if (search.filter_created_by) {
      query.andWhere('customer.created_by = :created_by', {
        created_by: search.filter_created_by,
      });
    }

    if (search.filter_updated_by) {
      query.andWhere('customer.updated_by = :updated_by', {
        updated_by: search.filter_updated_by,
      });
    }

    if (search.filter_created_by_email) {
      query.andWhere('created_by_user.email = :created_by_email', {
        created_by_email: search.filter_created_by_email,
      });
    }

    if (search.filter_updated_by_email) {
      query.andWhere('updated_by_user.email = :updated_by_email', {
        updated_by_email: search.filter_updated_by_email,
      });
    }

    query.orderBy(`customer.${order.order}`, order.dir);

    if (pagination.offset) {
      query.skip(pagination.offset);
    }
    if (pagination.limit) {
      query.take(pagination.limit);
    }
    const [items, count] = await query.getManyAndCount();
    return { items, count };
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
