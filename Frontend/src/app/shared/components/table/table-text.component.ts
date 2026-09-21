import { Component, Input } from '@angular/core';
import { TruncatePipe, TABLE_TEXT_MAX_LENGTH } from '../../pipes/truncate.pipe';

@Component({
  selector: 'app-table-text',
  standalone: true,
  imports: [TruncatePipe],
  template: `
    <span class="block max-w-[14rem] truncate" [title]="fullText">
      {{ fullText ? (value | truncate:limit) : empty }}
    </span>
  `,
})
export class TableTextComponent {
  @Input() value: string | null | undefined;
  @Input() limit = TABLE_TEXT_MAX_LENGTH;
  @Input() empty = '-';

  get fullText(): string {
    return (this.value ?? '').replace(/\s+/g, ' ').trim();
  }
}
