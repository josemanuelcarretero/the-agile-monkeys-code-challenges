import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '../config/config.module';
import { CommonModule } from '../common/common.module';
import { AppConfig } from '../config/entities/app-config.entity';
import { JwtStrategy } from './providers/jwt.strategy';

@Module({})
export class AuthModule {
  static async registerAsync(testing = false): Promise<DynamicModule> {
    return {
      module: AuthModule,
      imports: [
        ConfigModule,
        UserModule.registerAsync(testing),
        CommonModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: ['AppConfig'],
          useFactory: async (config: AppConfig) => ({
            secret: config.jwt.secret,
            signOptions: { expiresIn: config.jwt.expires_in },
          }),
        }),
      ],
      controllers: [AuthController],
      providers: [AuthService, JwtStrategy],
      exports: [AuthService],
    };
  }
}
