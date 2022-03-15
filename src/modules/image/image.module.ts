import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ConfigModule } from '../config/config.module';
import { ImageController } from './image.controller';

@Module({
  imports: [ConfigModule],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
