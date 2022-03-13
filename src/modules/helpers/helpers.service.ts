import { compare, genSalt, hash } from 'bcrypt';
import { Inject, Injectable } from '@nestjs/common';
import { AppConfig } from '../config/entities/app-config.entity';
import * as crypto from 'crypto-js';

@Injectable()
export class HelperService {
  constructor(@Inject('AppConfig') public readonly config: AppConfig) {}

  async encrypt(plainTextPassword: string) {
    const salt = await genSalt(this.config.password.salt_rounds);
    return hash(plainTextPassword, salt);
  }

  async matchPassword(hashedPassword: string, plainTextPassword: string) {
    return compare(plainTextPassword, hashedPassword);
  }

  async obfuscateExternalId(externalId: string) {
    return crypto.MD5(externalId).toString() + '_' + Date.now();
  }

  async obfuscateEmail(email: string) {
    return (
      (await this.obfuscateExternalId(email)) + '@' + this.config.app.domain
    );
  }
}
