import { Inject, Injectable } from '@nestjs/common';

import { User } from './models/user.model';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
import { UserAlreadyExistsException } from './exceptions/user-already-exists.exception';
import { Repository } from 'typeorm';
import { HelperService } from '../helpers/helpers.service';
import { randomBytes } from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: Repository<User>,
    private readonly helperService: HelperService,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({ deleted: false });
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
