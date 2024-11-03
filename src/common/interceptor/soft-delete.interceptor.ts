import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class FilterSoftDeletedInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    if (req.query.softDelete === undefined) {
      req.query.softDelete = false;
    } else {
      req.query.softDelete = req.query.softDelete === 'true';
    }

    return next.handle();
  }
}
