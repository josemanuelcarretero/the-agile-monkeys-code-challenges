import { Inject, Injectable } from '@nestjs/common';
import { AppConfig } from '../config/entities/app-config.entity';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import { Express } from 'express';

@Injectable()
export class ImageService {
  constructor(@Inject('AppConfig') public readonly config: AppConfig) {}

  async uploadFile(file: Express.Multer.File): Promise<string> {
    if (
      this.config.aws.access_key_id &&
      this.config.aws.secret_access_key &&
      this.config.aws.region &&
      this.config.aws.bucket
    ) {
      const s3 = new AWS.S3();
      const params = {
        Bucket: this.config.aws.bucket,
        Key: file.filename,
        Body: fs.createReadStream(file.path),
        ACL: 'public-read',
      };
      return new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data.Location);
          }
        });
      });
    } else {
      return `${this.config.app.base_url}${this.config.app.prefix_images}${file.filename}`;
    }
  }
}
