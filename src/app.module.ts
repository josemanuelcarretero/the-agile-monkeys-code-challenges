import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from './modules/config/config.module';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/user/user.module';
import { CommonModule } from './modules/common/common.module';
import { CustomerModule } from './modules/customer/customer.module';
import { AuthModule } from './modules/auth/auth.module';
import { ImageModule } from './modules/image/image.module';
import { InitModule } from './modules/init/init.module';

@Module({})
export class AppModule {
  static registerAsync(testing?: boolean): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule,
        DatabaseModule.registerAsync(testing),
        CommonModule,
        AuthModule.registerAsync(testing),
        UserModule.registerAsync(testing),
        CustomerModule.registerAsync(testing),
        ImageModule,
        InitModule,
      ],
    };
  }
}
