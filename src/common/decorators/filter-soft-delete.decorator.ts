import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FilterSoftDeletedInterceptor } from '../interceptor/soft-delete.interceptor';

export function FilterSoftDelete() {
  return applyDecorators(UseInterceptors(FilterSoftDeletedInterceptor));
}
