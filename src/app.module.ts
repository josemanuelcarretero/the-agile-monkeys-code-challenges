import { Module } from '@nestjs/common';
import { ConfigModule } from './modules/config/config.module';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/user/user.module';
import { HelperModule } from './modules/helpers/helpers.module';

@Module({
  imports: [ConfigModule, DatabaseModule, HelperModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
