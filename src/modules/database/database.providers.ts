import { createConnection } from 'typeorm';
import { ConnectionOptions } from 'typeorm/connection/ConnectionOptions';
import { AppConfig } from '../config/entities/app-config.entity';

export const databaseProviders = [
  {
    provide: 'DatabaseConnection',
    inject: ['AppConfig'],
    useFactory: async (config: AppConfig) =>
      await createConnection({
        name: 'default',
        type: config.database.type,
        host: config.database.host,
        port: config.database.port,
        username: config.database.username,
        password: config.database.password,
        database: config.database.database,
        migrationsTableName: 'migrations',
        entities: [__dirname + '../../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        subscribers: [__dirname + '/subscribers/**/*{.ts,.js}'],
        synchronize: false,
        migrationsRun: false,
        logging: false,
        cli: {
          migrationsDir: './src/modules/database/migrations',
          subscribersDir: './src/modules/database/subscribers',
        },
        keepConnectionAlive: true,
        autoLoadEntities: true,
      } as ConnectionOptions),
  },
];

export const testDatabaseProviders = [
  {
    provide: 'DatabaseConnection',
    inject: ['AppConfig'],
    useFactory: async (config: AppConfig) => {
      return await createConnection({
        type: config.test_database.type,
        host: config.test_database.host,
        port: config.test_database.port,
        username: config.test_database.username,
        password: config.test_database.password,
        database: config.test_database.database,
        migrationsTableName: 'migrations',
        entities: [__dirname + '../../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        subscribers: [__dirname + '/subscribers/**/*{.ts,.js}'],
        synchronize: true,
        migrationsRun: false,
        logging: false,
        cli: {
          migrationsDir: './src/modules/database/migrations',
          subscribersDir: './src/modules/database/subscribers',
        },
        keepConnectionAlive: true,
        autoLoadEntities: true,
      } as ConnectionOptions);
    },
  },
];
