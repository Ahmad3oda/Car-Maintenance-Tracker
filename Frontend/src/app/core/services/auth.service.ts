import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { PhotoService } from './photo.service';

export interface AuthUser {
  id: number;
  username: string;
}

interface AuthResponse {
  accessToken: string;
  expiresIn: number;
  user: AuthUser;
}

interface StoredSession {
  accessToken: string;
  /** Epoch milliseconds. */
  expiresAt: number;
  user: AuthUser;
}

const STORAGE_KEY = 'cmt.session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly photos = inject(PhotoService);

  private readonly session = signal<StoredSession | null>(this.restore());
  private expiryTimer?: ReturnType<typeof setTimeout>;

  readonly user = computed(() => this.session()?.user ?? null);

  constructor() {
    this.scheduleExpiry();
  }

  get token(): string | null {
    return this.isLoggedIn() ? this.session()!.accessToken : null;
  }

  isLoggedIn(): boolean {
    const session = this.session();
    return !!session && session.expiresAt > Date.now();
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>('/auth/login', { username, password })
      .pipe(tap((res) => this.start(res)));
  }

  register(username: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>('/auth/register', { username, password })
      .pipe(tap((res) => this.start(res)));
  }

  /** Clears the session; with a reason, sends the user to the login page. */
  logout(reason?: 'expired'): void {
    clearTimeout(this.expiryTimer);
    this.session.set(null);
    this.photos.clear();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage unavailable (private mode); nothing persisted anyway.
    }

    const returnUrl = this.router.url;
    const onAuthPage = /^\/(login|register)/.test(returnUrl);
    void this.router.navigate(['/login'], {
      queryParams:
        reason && !onAuthPage ? { reason, returnUrl } : undefined,
    });
  }

  private start(res: AuthResponse): void {
    const session: StoredSession = {
      accessToken: res.accessToken,
      expiresAt: Date.now() + res.expiresIn * 1000,
      user: res.user,
    };
    this.session.set(session);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
      // Storage unavailable: the session lasts until the page is closed.
    }
    this.scheduleExpiry();
  }

  private restore(): StoredSession | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const session = raw ? (JSON.parse(raw) as StoredSession) : null;
      return session && session.expiresAt > Date.now() ? session : null;
    } catch {
      return null;
    }
  }

  /** Logs out when the token expires, even if no request is made. */
  private scheduleExpiry(): void {
    clearTimeout(this.expiryTimer);
    const session = this.session();
    if (!session) return;
    // setTimeout overflows above ~24.8 days; tokens last 7.
    const delay = Math.min(session.expiresAt - Date.now(), 2 ** 31 - 1);
    this.expiryTimer = setTimeout(() => this.logout('expired'), delay);
  }
}
