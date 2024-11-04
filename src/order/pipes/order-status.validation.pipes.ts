import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ORDER_STATUS } from '../constants/status.constants';

@Injectable()
export class OrderStatusValidationPipe implements PipeTransform {
  transform(value: any) {
    if (!Object.values(ORDER_STATUS).includes(value)) {
      throw new BadRequestException(`'${value}' is an invalid order status`);
    }
    return value;
  }
}
