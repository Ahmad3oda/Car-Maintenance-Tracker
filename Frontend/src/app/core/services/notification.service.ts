import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notifications$ = new BehaviorSubject<ToastNotification[]>([]);

  get notifications(): Observable<ToastNotification[]> {
    return this.notifications$.asObservable();
  }

  showSuccess(message: string, durationMs: number = 4000): void {
    this.addNotification('success', message, durationMs);
  }

  showError(message: string, durationMs: number = 4000): void {
    this.addNotification('error', message, durationMs);
  }

  showInfo(message: string, durationMs: number = 4000): void {
    this.addNotification('info', message, durationMs);
  }

  showWarning(message: string, durationMs: number = 4000): void {
    this.addNotification('warning', message, durationMs);
  }

  remove(id: string): void {
    const current = this.notifications$.value.filter((n) => n.id !== id);
    this.notifications$.next(current);
  }

  private addNotification(
    type: 'success' | 'error' | 'info' | 'warning',
    message: string,
    durationMs: number,
  ): void {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newNotification: ToastNotification = { id, type, message };
    const current = this.notifications$.value;
    this.notifications$.next([...current, newNotification]);

    if (durationMs > 0) {
      setTimeout(() => {
        this.remove(id);
      }, durationMs);
    }
  }
}
