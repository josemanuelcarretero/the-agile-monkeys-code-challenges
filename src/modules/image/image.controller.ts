import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { ImageService } from './image.service';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AppConfig } from '../config/entities/app-config.entity';
import { UploadResponse } from './responses';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { diskStorage } from 'fastify-multer';
import { extname } from 'path';
import { FastifyRequest } from 'fastify';
import { UploadFileDto } from './dtos';

import { Express } from 'express';
import { FastifyFileInterceptor } from 'nest-fastify-multer';
import {
  FileWasEmptyOrNotValidException,
  OnlyTheseExtensionsAllowedException,
} from './exceptions';
import { GetFileByFilenameDto } from './dtos/get-file-by-filename.dto';

@ApiTags('Image')
@Controller('v1/image')
export class ImageController {
  constructor(
    private imageService: ImageService,
    @Inject('AppConfig') private readonly config: AppConfig,
  ) {}

  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload single file',
  })
  @ApiResponse({
    status: 201,
    type: UploadResponse,
  })
  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @FastifyFileInterceptor('file', {
    storage: diskStorage({
      destination: __dirname + '/../../../images',
      filename: (req: FastifyRequest, file, cb) => {
        const randomName = Array(32)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req: FastifyRequest, file, cb) => {
      const ext = extname(file.originalname);
      const allowedExtensions = ['.jpg', '.png', '.jpeg'];
      if (!allowedExtensions.includes(ext)) {
        return cb(
          new OnlyTheseExtensionsAllowedException(['.png', '.jpg', '.jpeg']),
          false,
        );
      }
      return cb(null, true);
    },
  })
  async uploadFile(
    @Req() req: FastifyRequest,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadFileDto,
  ) {
    if (!file) {
      throw new FileWasEmptyOrNotValidException();
    }
    return new UploadResponse(await this.imageService.uploadFile(file));
  }

  @Get(':filename')
  @ApiOperation({
    summary: 'Get image by filename',
  })
  downloadFile(@Param() { filename }: GetFileByFilenameDto, @Res() res) {
    return res.sendFile(filename, { root: 'images' });
  }
}
