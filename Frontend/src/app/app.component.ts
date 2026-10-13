import { Component, NgZone, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnDestroy {
  title = 'Frontend';

  /** Feeds the cursor position to the hovered .spotlight card (styles.css).
   *  Runs outside Angular so mouse moves never trigger change detection. */
  private readonly onPointerMove = (event: PointerEvent) => {
    const card = (event.target as Element | null)?.closest?.('.spotlight') as HTMLElement | null;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    card.style.setProperty('--my', `${event.clientY - rect.top}px`);
  };

  constructor() {
    inject(NgZone).runOutsideAngular(() =>
      document.addEventListener('pointermove', this.onPointerMove, { passive: true }),
    );
  }

  ngOnDestroy(): void {
    document.removeEventListener('pointermove', this.onPointerMove);
  }
}
