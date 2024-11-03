import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';
import { CommonDto } from './common.dto';

export class PaginationDto extends CommonDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number = 10;
}
