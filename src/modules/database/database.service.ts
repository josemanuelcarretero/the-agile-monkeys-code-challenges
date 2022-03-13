import { BeforeApplicationShutdown, Inject, Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class DatabaseService implements BeforeApplicationShutdown {
  constructor(
    @Inject('DatabaseConnection')
    private readonly connection: Connection,
  ) {}

  async beforeApplicationShutdown() {
    await this.connection.close();
  }
}
