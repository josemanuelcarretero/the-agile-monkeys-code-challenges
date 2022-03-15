import { Module } from '@nestjs/common';
import { ConfigModule } from './modules/config/config.module';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/user/user.module';
import { HelperModule } from './modules/helpers/helpers.module';
import { CustomerModule } from './modules/customer/customer.module';
import { AuthModule } from './modules/auth/auth.module';
import { ImageModule } from './modules/image/image.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    HelperModule,
    AuthModule,
    UserModule,
    CustomerModule,
    ImageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
