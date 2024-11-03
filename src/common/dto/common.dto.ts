import { Type } from 'class-transformer';
import { IsOptional, IsBoolean } from 'class-validator';

export class CommonDto {
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  softDelete?: boolean;

  @IsOptional()
  @Type(() => Date)
  createAt?: Date;
}
