import { DatabaseModule } from '../database/database.module';
import { CustomerService } from './customer.service';
import { Module } from '@nestjs/common';
import { customerProviders } from './entities/customer.providers';
import { CustomerController } from './customer.controller';
import { HelperModule } from '../helpers/helpers.module';

@Module({
  imports: [DatabaseModule, HelperModule],
  controllers: [CustomerController],
  providers: [CustomerService, ...customerProviders],
  exports: [CustomerService, ...customerProviders],
})
export class CustomerModule {}
