import { Module } from '@nestjs/common';
import { configProviders } from './entities/config.providers';

@Module({
  imports: [],
  providers: [...configProviders],
  exports: [...configProviders],
})
export class ConfigModule {}
