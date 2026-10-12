import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SILENT_ERRORS } from '../interceptors/error.interceptor';

/**
 * Photos need the login token, which <img src> cannot send, so they are
 * fetched with HttpClient and shown through local blob: URLs.
 */
@Injectable({ providedIn: 'root' })
export class PhotoService {
  private readonly http = inject(HttpClient);
  private readonly cache = new Map<string, Observable<string | null>>();
  private readonly objectUrls = new Set<string>();

  /** A displayable URL; null while unavailable (missing or not allowed). */
  load(url: string | null | undefined): Observable<string | null> {
    // Local previews (data:/blob:) and non-API URLs need no token.
    if (!url || !url.startsWith(environment.apiUrl)) return of(url ?? null);

    let photo = this.cache.get(url);
    if (!photo) {
      photo = this.http
        .get(url, {
          responseType: 'blob',
          context: new HttpContext().set(SILENT_ERRORS, true),
        })
        .pipe(
          map((blob) => {
            const objectUrl = URL.createObjectURL(blob);
            this.objectUrls.add(objectUrl);
            return objectUrl;
          }),
          catchError(() => {
            this.cache.delete(url);
            return of(null);
          }),
          shareReplay(1),
        );
      this.cache.set(url, photo);
    }
    return photo;
  }

  /** Frees every loaded photo; called on logout. */
  clear(): void {
    this.objectUrls.forEach((url) => URL.revokeObjectURL(url));
    this.objectUrls.clear();
    this.cache.clear();
  }
}
