import { DatabaseModule } from '../database/database.module';
import { UserService } from './user.service';
import { DynamicModule, Module } from '@nestjs/common';
import { userProviders } from './entities/user.providers';
import { UserController } from './user.controller';
import { CommonModule } from '../common/common.module';

@Module({})
export class UserModule {
  static async registerAsync(testing?: boolean): Promise<DynamicModule> {
    return {
      module: UserModule,
      imports: [DatabaseModule.registerAsync(testing), CommonModule],
      controllers: [UserController],
      providers: [UserService, ...userProviders],
      exports: [UserService, ...userProviders],
    };
  }
}
