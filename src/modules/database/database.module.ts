import { DynamicModule, Module } from '@nestjs/common';
import { databaseProviders, testDatabaseProviders } from './database.providers';
import { ConfigModule } from '../config/config.module';
import { DatabaseService } from './database.service';

@Module({})
export class DatabaseModule {
  static async registerAsync(testing?: boolean): Promise<DynamicModule> {
    if (testing) {
      return {
        module: DatabaseModule,
        imports: [ConfigModule],
        providers: [DatabaseService, ...testDatabaseProviders],
        exports: [DatabaseService, ...testDatabaseProviders],
      };
    } else {
      return {
        module: DatabaseModule,
        imports: [ConfigModule],
        providers: [DatabaseService, ...databaseProviders],
        exports: [DatabaseService, ...databaseProviders],
      };
    }
  }
}
