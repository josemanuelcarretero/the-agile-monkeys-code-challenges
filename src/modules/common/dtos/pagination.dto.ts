import { IsNumber, Min, Max } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @Min(0)
  public readonly offset: number = 0;

  @IsNumber()
  @Min(0)
  @Max(200)
  public readonly limit: number = 20;
}
