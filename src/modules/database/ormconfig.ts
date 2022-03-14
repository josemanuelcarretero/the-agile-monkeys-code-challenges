import { config } from 'dotenv';

config({ debug: false });

module.exports = [
  {
    name: 'default',
    type: process.env.dbtype,
    host: process.env.dbhost,
    port: parseInt(process.env.dbport),
    username: process.env.dbusername,
    password: process.env.dbpassword,
    database: process.env.dbdatabase,
    migrationsTableName: 'migrations',
    entities: [__dirname + '../../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    subscribers: [__dirname + '/subscribers/**/*{.ts,.js}'],
    synchronize: false,
    migrationsRun: true,
    logging: true,
    cli: {
      migrationsDir: './dist/modules/database/migrations',
      subscribersDir: './dist/modules/database/subscribers',
    },
  },
];
