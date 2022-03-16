export interface AppConfig {
  readonly database: {
    readonly type: string;
    readonly host: string;
    readonly port: string;
    readonly username: string;
    readonly password: string;
    readonly database: string;
  };
  readonly password: {
    readonly salt_rounds: number;
  };
  readonly jwt: {
    readonly secret: string;
    readonly expires_in: string;
  };
  readonly app: {
    readonly domain: string;
    readonly prefix_images: string;
    readonly base_url: string;
  };
  readonly aws: {
    readonly access_key_id: string;
    readonly secret_access_key: string;
    readonly region: string;
    readonly bucket: string;
  };
  readonly test_database: {
    readonly type: string;
    readonly host: string;
    readonly port: string;
    readonly username: string;
    readonly password: string;
    readonly database: string;
  };
}
