import { DatabaseModule } from '../database/database.module';
import { CustomerService } from './customer.service';
import { DynamicModule, Module } from '@nestjs/common';
import { customerProviders } from './entities/customer.providers';
import { CustomerController } from './customer.controller';
import { CommonModule } from '../common/common.module';

@Module({})
export class CustomerModule {
  static async registerAsync(testing?: boolean): Promise<DynamicModule> {
    return {
      module: CustomerModule,
      imports: [DatabaseModule.registerAsync(testing), CommonModule],
      controllers: [CustomerController],
      providers: [CustomerService, ...customerProviders],
      exports: [CustomerService, ...customerProviders],
    };
  }
}
