import { UserType } from '../../../src/modules/user/enums/user-type.enum';
import * as faker from 'faker';
import { v4 as uuid } from 'uuid';
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../../src/modules/user/models/user.model';
import { Customer } from '../../../src/modules/customer/models/customer.model';
import { CustomerService } from '../../../src/modules/customer/customer.service';
import { UserService } from '../../../src/modules/user/user.service';
import { AuthService } from '../../../src/modules/auth/auth.service';

@Injectable()
export class UtilService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: Repository<User>,
    @Inject('CustomerRepository')
    private readonly customerRepository: Repository<Customer>,
    private readonly userService: UserService,
    private readonly customerService: CustomerService,
    private readonly authService: AuthService,
  ) {}

  async generateRandomUser(overrideData?: any) {
    return {
      name: faker.name.findName(),
      surname: faker.name.lastName(),
      email: uuid() + '+' + faker.internet.email(),
      password: faker.internet.password(),
      type: UserType.ADMIN,
      ...(overrideData ?? {}),
    };
  }

  async generateRandomCustomer(overrideData?: any) {
    return {
      name: faker.name.findName(),
      surname: faker.name.lastName(),
      external_id: uuid(),
      image: faker.image.imageUrl(),
      ...(overrideData ?? {}),
    };
  }

  async insertRandomUser(overrideData?: any) {
    const user = await this.generateRandomUser(overrideData);
    await this.userRepository.delete({ email: user.email });
    const userSaved = await this.userService.create(user);
    return {
      id: userSaved.id,
      email: userSaved.email,
      name: userSaved.name,
      surname: userSaved.surname,
      type: userSaved.type,
      created_at: userSaved.created_at.toISOString(),
      updated_at: userSaved.updated_at.toISOString(),
      password: user.password,
    };
  }

  async insertRandomCustomer(user: any, overrideData?: any) {
    const customer = await this.generateRandomCustomer(overrideData);
    await this.customerRepository.delete({ external_id: customer.external_id });
    const customerSaved = await this.customerService.create(customer, user);
    return {
      id: customerSaved.id,
      name: customerSaved.name,
      surname: customerSaved.surname,
      external_id: customerSaved.external_id,
      image: customerSaved.image,
      created_at: customerSaved.created_at.toISOString(),
      updated_at: customerSaved.updated_at.toISOString(),
      created_by: {
        id: customerSaved.created_by.id,
        name: customerSaved.created_by.name,
        surname: customerSaved.created_by.surname,
        email: customerSaved.created_by.email,
        type: customerSaved.created_by.type,
        created_at: customerSaved.created_by.created_at.toISOString(),
        updated_at: customerSaved.created_by.updated_at.toISOString(),
      },
      updated_by: {
        id: customerSaved.updated_by.id,
        name: customerSaved.updated_by.name,
        surname: customerSaved.updated_by.surname,
        email: customerSaved.updated_by.email,
        type: customerSaved.updated_by.type,
        created_at: customerSaved.updated_by.created_at.toISOString(),
        updated_at: customerSaved.updated_by.updated_at.toISOString(),
      },
    };
  }

  async getUserSigned(overrideData?: any) {
    const user = await this.insertRandomUser(overrideData);
    const token = await this.authService.generateAccessToken({
      ...user,
      created_at: new Date(user.created_at),
      updated_at: new Date(user.updated_at),
      deleted: false,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        type: user.type,
        password: user.password,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      access_token: token.access_token,
    };
  }

  async clearDatabase() {
    await this.customerRepository.delete({});
    await this.userRepository.delete({});
  }

  mapUsersWithPagination(
    users,
    options?: {
      limit?: number;
      offset?: number;
      total?: number;
      dir?: string;
      order?: string;
    },
  ) {
    const userWithPagination = [];
    users.forEach((user) => {
      userWithPagination.push({
        id: user.id,
        name: user.name,
        email: user.email,
        surname: user.surname,
        type: user.type,
        created_at: user.created_at,
        updated_at: user.updated_at,
      });
    });

    return {
      success: true,
      message: 'User list successfully retrieved',
      code: 'UserListSuccessfullyRetrievedResponse',
      data: userWithPagination,
      order: {
        dir: options?.dir ?? 'ASC',
        order: options?.order ?? 'created_at',
      },
      pagination: {
        length: users.length,
        limit: options?.limit ?? 20,
        offset: options?.offset ?? 0,
        total: options?.total ?? users.length,
      },
    };
  }

  mapCustomersWithPagination(
    customers,
    options?: {
      limit?: number;
      offset?: number;
      total?: number;
      dir?: string;
      order?: string;
    },
  ) {
    const customerWithPagination = [];
    customers.forEach((customer) => {
      customerWithPagination.push({
        id: customer.id,
        name: customer.name,
        surname: customer.surname,
        external_id: customer.external_id,
        image: customer.image,
        created_at: customer.created_at,
        updated_at: customer.updated_at,
        created_by: {
          id: customer.created_by.id,
          name: customer.created_by.name,
          surname: customer.created_by.surname,
          email: customer.created_by.email,
          type: customer.created_by.type,
          created_at: customer.created_by.created_at,
          updated_at: customer.created_by.updated_at,
        },
        updated_by: {
          id: customer.updated_by.id,
          name: customer.updated_by.name,
          surname: customer.updated_by.surname,
          email: customer.updated_by.email,
          type: customer.updated_by.type,
          created_at: customer.updated_by.created_at,
          updated_at: customer.updated_by.updated_at,
        },
      });
    });

    return {
      success: true,
      message: 'Customer list successfully retrieved',
      code: 'CustomerListSuccessfullyRetrievedResponse',
      data: customerWithPagination,
      order: {
        dir: options?.dir ?? 'ASC',
        order: options?.order ?? 'created_at',
      },
      pagination: {
        length: customers.length,
        limit: options?.limit ?? 20,
        offset: options?.offset ?? 0,
        total: options?.total ?? customers.length,
      },
    };
  }
}
