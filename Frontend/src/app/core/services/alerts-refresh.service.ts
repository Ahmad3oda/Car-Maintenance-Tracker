import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/** Tells the header bell that maintenance data changed and alerts should reload. */
@Injectable({ providedIn: 'root' })
export class AlertsRefreshService {
  readonly changed$ = new Subject<void>();

  notifyChanged(): void {
    this.changed$.next();
  }
}
