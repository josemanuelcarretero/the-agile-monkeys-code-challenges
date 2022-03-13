import { Injectable, Inject } from '@nestjs/common';

import { User } from './models/user.model';
import {
  CreateUserDto,
  UpdateUserDto,
  UserFiltersDto,
  UserOrderDto,
} from './dtos';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
import { UserAlreadyExistsException } from './exceptions/user-already-exists.exception';
import { Repository } from 'typeorm';
import { HelperService } from '../helpers/helpers.service';
import { randomBytes } from 'crypto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: Repository<User>,
    private readonly helperService: HelperService,
  ) {}

  async findAndCount({
    search,
    order,
    pagination,
  }: {
    search: UserFiltersDto;
    order: UserOrderDto;
    pagination: PaginationDto;
  }) {
    const query = this.userRepository.createQueryBuilder('user');
    query.where('user.deleted = false');

    if (search.query) {
      query.andWhere(
        'user.name LIKE :query' +
          ' OR user.surname LIKE :query' +
          ' OR user.email LIKE :query' +
          ' OR user.created_by::text LIKE :query' +
          ' OR user.updated_by::text LIKE :query',
        { query: `%${search.query}%` },
      );
    }

    if (search.filter_name) {
      query.andWhere('user.name = :name', { name: search.filter_name });
    }

    if (search.filter_surname) {
      query.andWhere('user.surname = :surname', {
        surname: search.filter_surname,
      });
    }

    if (search.filter_email) {
      query.andWhere('user.email = :email', {
        email: search.filter_email,
      });
    }

    if (search.filter_type) {
      query.andWhere('user.type = :type', {
        type: search.filter_type,
      });
    }

    if (search.filter_created_at) {
      query.andWhere('user.created_at = :created_at', {
        created_at: search.filter_created_at,
      });
    }

    if (search.filter_updated_at) {
      query.andWhere('user.updated_at = :updated_at', {
        updated_at: search.filter_updated_at,
      });
    }

    if (search.filter_created_at_from) {
      query.andWhere('user.created_at >= :created_at_from', {
        created_at_from: search.filter_created_at_from,
      });
    }

    if (search.filter_created_at_to) {
      query.andWhere('user.created_at <= :created_at_to', {
        created_at_to: search.filter_created_at_to,
      });
    }

    if (search.filter_updated_at_from) {
      query.andWhere('user.updated_at >= :updated_at_from', {
        updated_at_from: search.filter_updated_at_from,
      });
    }

    if (search.filter_updated_at_to) {
      query.andWhere('user.updated_at <= :updated_at_to', {
        updated_at_to: search.filter_updated_at_to,
      });
    }

    query.orderBy(`user.${order.order}`, order.dir);

    if (pagination.offset) {
      query.skip(pagination.offset);
    }
    if (pagination.limit) {
      query.take(pagination.limit);
    }
    const [items, count] = await query.getManyAndCount();
    return { items, count };
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, deleted: false },
    });
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email, deleted: false },
    });
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const insertResult = await this.userRepository.insert({
        ...createUserDto,
        password: await this.helperService.encrypt(createUserDto.password),
      });
      return await this.userRepository.findOne(insertResult.identifiers[0].id);
    } catch (e) {
      throw new UserAlreadyExistsException();
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, deleted: false },
    });
    if (!user) {
      throw new UserNotFoundException();
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const userExists = await this.userRepository.findOne({
        where: { email: updateUserDto.email, deleted: false },
      });
      if (userExists) {
        throw new UserAlreadyExistsException();
      }
    }

    return await this.userRepository.save({
      ...user,
      ...updateUserDto,
      ...(updateUserDto.password
        ? { password: await this.helperService.encrypt(updateUserDto.password) }
        : {}),
    });
  }

  async deleteById(id: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id, deleted: false },
    });
    if (!user) {
      throw new UserNotFoundException();
    }
    const savedUser = await this.userRepository.save({
      ...user,
      name: `Removed User`,
      surname: '',
      email: await this.helperService.obfuscateEmail(user.email),
      password: randomBytes(16).toString('hex'),
      deleted: true,
      deleted_at: new Date(),
    });
    return savedUser?.deleted ?? false;
  }
}
