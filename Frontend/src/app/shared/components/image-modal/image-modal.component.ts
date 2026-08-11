import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="isOpen"
      class="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 md:p-10 animate-in fade-in duration-200"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        (click)="close()"
      ></div>

      <!-- Modal Content -->
      <div
        class="relative max-w-4xl max-h-[90vh] w-full flex flex-col bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 z-10 animate-in zoom-in-95 duration-200"
        (click)="$event.stopPropagation()"
      >
        <!-- Modal Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gray-900/90">
          <div class="flex items-center space-x-2 text-white">
            <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 class="text-base font-bold text-white truncate">{{ title || 'Image Preview' }}</h3>
          </div>

          <button
            (click)="close()"
            class="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
            aria-label="Close"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Image Container -->
        <div class="relative flex-1 flex items-center justify-center p-4 bg-black/60 overflow-auto min-h-[300px] max-h-[75vh]">
          <img
            [src]="imageUrl"
            [alt]="title || 'Preview'"
            class="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg select-none"
          />
        </div>
      </div>
    </div>
  `,
})
export class ImageModalComponent {
  @Input() isOpen = false;
  @Input() imageUrl: string | null = null;
  @Input() title = '';
  @Output() closed = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.isOpen) {
      this.close();
    }
  }

  close() {
    this.isOpen = false;
    this.closed.emit();
  }
}
