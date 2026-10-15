import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DashboardService } from './dashboard.service';

describe('DashboardService.getDueAlertsSummary', () => {
  let service: DashboardService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(DashboardService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  const meta = (totalItems: number) => ({
    page: 1, limit: 10, totalItems, totalPages: 1, hasPreviousPage: false, hasNextPage: false,
  });

  it('counts overdue and due-soon items across all pages, not just the 10 shown', () => {
    let result: { overdue: number; dueSoon: number; totalDue: number } | undefined;
    service.getDueAlertsSummary().subscribe((s) => (result = s));

    http
      .expectOne((r) => r.url === '/items/upcoming' && r.params.get('scope') === 'due_soon_or_overdue')
      .flush({ data: new Array(10).fill({ status: 'DUE_SOON' }), meta: meta(25) });
    http
      .expectOne((r) => r.url === '/items/upcoming' && r.params.get('scope') === 'overdue_only')
      .flush({ data: [], meta: meta(7) });

    expect(result).toEqual(jasmine.objectContaining({ totalDue: 25, overdue: 7, dueSoon: 18 }));
  });

  it('falls back to zero counts when the request fails', () => {
    let result: { totalDue: number } | undefined;
    service.getDueAlertsSummary().subscribe((s) => (result = s));
    // The first failure cancels the other request, so only one is answered.
    const [first] = http.match((r) => r.url === '/items/upcoming');
    first.flush({}, { status: 500, statusText: 'Server Error' });
    expect(result?.totalDue).toBe(0);
  });
});
