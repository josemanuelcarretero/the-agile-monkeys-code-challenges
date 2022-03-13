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
  };
}
