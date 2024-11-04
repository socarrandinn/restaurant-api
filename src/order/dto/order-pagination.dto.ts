import { IsOptional, IsEnum } from 'class-validator';
import { PaginationDto } from 'src/common';
import { ORDER_STATUS } from '../constants/status.constants';

export class OrderPaginationDto extends PaginationDto {
  @IsOptional()
  @IsEnum(ORDER_STATUS)
  status?: ORDER_STATUS;
}
