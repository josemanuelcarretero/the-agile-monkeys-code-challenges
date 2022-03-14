import { PaginationDto } from './pagination.dto';
import { ApiProperty } from '@nestjs/swagger';

export class OutputPaginationDto extends PaginationDto {
  @ApiProperty({
    description: 'Total number of items',
    required: false,
    default: 1,
  })
  public readonly total: number;
  @ApiProperty({
    description: 'Total number of returned items',
    required: false,
    default: 1,
  })
  public readonly length: number;
}
