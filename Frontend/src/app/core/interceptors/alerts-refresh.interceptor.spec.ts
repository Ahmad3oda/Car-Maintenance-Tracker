import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { alertsRefreshInterceptor } from './alerts-refresh.interceptor';
import { AlertsRefreshService } from '../services/alerts-refresh.service';

describe('alertsRefreshInterceptor', () => {
  let http: HttpClient;
  let backend: HttpTestingController;
  let notified: number;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([alertsRefreshInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
    notified = 0;
    TestBed.inject(AlertsRefreshService).changed$.subscribe(() => notified++);
  });

  afterEach(() => backend.verify());

  it('notifies after a successful record save', () => {
    http.post('http://api/maintenance-records', {}).subscribe();
    backend.expectOne('http://api/maintenance-records').flush({ id: 1 });
    expect(notified).toBe(1);
  });

  it('notifies after an odometer update and an item delete', () => {
    http.patch('http://api/cars/3', { currentKm: 1 }).subscribe();
    backend.expectOne('http://api/cars/3').flush({});
    http.delete('http://api/items/7').subscribe();
    backend.expectOne('http://api/items/7').flush(null, { status: 204, statusText: 'No Content' });
    expect(notified).toBe(2);
  });

  it('ignores reads', () => {
    http.get('http://api/items/upcoming').subscribe();
    backend.expectOne('http://api/items/upcoming').flush({ data: [], meta: {} });
    expect(notified).toBe(0);
  });

  it('ignores failed saves', () => {
    http.post('http://api/cars', {}).subscribe({ error: () => {} });
    backend.expectOne('http://api/cars').flush({}, { status: 400, statusText: 'Bad Request' });
    expect(notified).toBe(0);
  });

  it('ignores login and other endpoints', () => {
    http.post('http://api/auth/login', {}).subscribe();
    backend.expectOne('http://api/auth/login').flush({});
    expect(notified).toBe(0);
  });
});
