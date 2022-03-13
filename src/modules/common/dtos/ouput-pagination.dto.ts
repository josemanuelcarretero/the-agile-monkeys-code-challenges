import { PaginationDto } from './pagination.dto';

export class OuputPaginationDto extends PaginationDto {
  public readonly total: number;
  public readonly length: number;
}
