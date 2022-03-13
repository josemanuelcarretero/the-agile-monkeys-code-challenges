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
  readonly app: {
    readonly domain: string;
  };
}
