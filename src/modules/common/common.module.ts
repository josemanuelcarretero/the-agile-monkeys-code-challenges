import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
