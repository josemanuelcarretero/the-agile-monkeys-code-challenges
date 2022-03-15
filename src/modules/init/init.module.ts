import { Module } from '@nestjs/common';
import { InitController } from './init.controller';

@Module({
  imports: [],
  controllers: [InitController],
  providers: [],
  exports: [],
})
export class InitModule {}
