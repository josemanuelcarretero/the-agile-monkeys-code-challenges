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
      base_url: process.env.app_base_url,
      prefix_images: process.env.app_prefix_images ?? '/v1/images',
    },
    aws: {
      access_key_id: process.env.aws_access_key_id,
      secret_access_key: process.env.aws_secret_access_key,
      region: process.env.aws_region,
      bucket: process.env.aws_bucket,
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
