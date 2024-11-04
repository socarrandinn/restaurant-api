import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { CommonDto } from 'src/common/dto/common.dto';
import { ORDER_STATUS } from '../constants/status.constants';

export class CreateOrderDto extends CommonDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  restaurantId: string;

  @ApiProperty({ enum: ORDER_STATUS, default: ORDER_STATUS.PENDING })
  @IsEnum(ORDER_STATUS)
  @IsOptional()
  status?: ORDER_STATUS;
}
