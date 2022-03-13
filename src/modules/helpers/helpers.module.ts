import { Module } from '@nestjs/common';
import { HelperService } from './helpers.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [HelperService],
  exports: [HelperService],
})
export class HelperModule {}
