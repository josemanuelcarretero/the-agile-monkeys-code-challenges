import { CustomerEntity } from './customer.entity';
import { Connection } from 'typeorm';

export const customerProviders = [
  {
    provide: 'CustomerRepository',
    useFactory: (connection: Connection) =>
      connection.getRepository(CustomerEntity),
    inject: ['DatabaseConnection'],
  },
];
