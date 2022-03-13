import { AppConfig } from './app-config.entity';
import { config } from 'dotenv';

function loadEnvironment(): AppConfig {
  config({ debug: false });
  return {
    database: {
      type: process.env.dbtype,
      host: process.env.dbhost,
      port: process.env.dbport,
      username: process.env.dbusername,
      password: process.env.dbpassword,
      database: process.env.dbdatabase,
    },
    password: {
      salt_rounds: parseInt(process.env.password_salt_rounds ?? '10'),
    },
    jwt: {
      secret: process.env.jwt_secret,
      expires_in: process.env.jwt_expires_in,
    },
    app: {
      domain: process.env.app_domain,
    },
  };
}

export const configProviders = [
  {
    provide: 'AppConfig',
    useFactory: async () => {
      return loadEnvironment();
    },
  },
];
