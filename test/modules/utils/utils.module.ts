import { Module } from '@nestjs/common';
import { UtilService } from './utils.service';
import { DatabaseModule } from '../../../src/modules/database/database.module';
import { UserModule } from '../../../src/modules/user/user.module';
import { CustomerModule } from '../../../src/modules/customer/customer.module';
import { AuthModule } from '../../../src/modules/auth/auth.module';

@Module({
  imports: [
    DatabaseModule.registerAsync(true),
    UserModule.registerAsync(true),
    CustomerModule.registerAsync(true),
    AuthModule.registerAsync(true),
  ],
  controllers: [],
  providers: [UtilService],
  exports: [UtilService],
})
export class UtilsModule {}
