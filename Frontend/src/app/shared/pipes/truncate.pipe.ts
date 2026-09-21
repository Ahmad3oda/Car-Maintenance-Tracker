import { Pipe, PipeTransform } from '@angular/core';

export const TABLE_TEXT_MAX_LENGTH = 40;

@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {
  transform(
    value: string | null | undefined,
    limit: number = TABLE_TEXT_MAX_LENGTH,
    ellipsis = '…',
  ): string {
    const text = (value ?? '').replace(/\s+/g, ' ').trim();
    if (!text) {
      return '';
    }
    if (limit <= 0 || text.length <= limit) {
      return text;
    }
    return `${text.slice(0, limit).trimEnd()}${ellipsis}`;
  }
}
