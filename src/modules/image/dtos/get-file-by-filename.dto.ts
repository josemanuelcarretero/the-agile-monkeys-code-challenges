import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetFileByFilenameDto {
  @ApiProperty({
    description: 'File name',
    example: 'file.jpg',
  })
  @IsNotEmpty({
    message: 'Filename must be not empty',
  })
  @IsString({
    message: 'Filename must be string',
  })
  filename: string;
}
