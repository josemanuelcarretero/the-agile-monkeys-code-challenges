import { IsInt, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PaginationDto {
  @ApiProperty({
    description: 'Page offset',
    required: false,
    default: 0,
  })
  @IsInt()
  @Type(() => Number)
  @Min(0)
  public readonly offset: number = 0;

  @ApiProperty({
    description: 'Page limit',
    required: false,
    default: 20,
  })
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(200)
  public readonly limit: number = 20;
}
