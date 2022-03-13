import { DatabaseModule } from '../database/database.module';
import { UserService } from './user.service';
import { Module } from '@nestjs/common';
import { userProviders } from './entities/user.providers';
import { UserController } from './user.controller';
import { HelperModule } from '../helpers/helpers.module';

@Module({
  imports: [DatabaseModule, HelperModule],
  controllers: [UserController],
  providers: [UserService, ...userProviders],
  exports: [UserService, ...userProviders],
})
export class UserModule {}
