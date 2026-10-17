import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { AllEventsComponent, SEARCH_DEBOUNCE_MS } from './all-events.component';

describe('AllEventsComponent search', () => {
  let fixture: ComponentFixture<AllEventsComponent>;
  let http: HttpTestingController;

  const page = { data: [], meta: { page: 1, limit: 10, totalItems: 0, totalPages: 0 } };
  const recordRequests = () =>
    http.match((r) => r.url === '/maintenance-records');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllEventsComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    fixture = TestBed.createComponent(AllEventsComponent);
    http = TestBed.inject(HttpTestingController);
  });

  it('sends one search after typing pauses, with the final text', fakeAsync(() => {
    fixture.detectChanges();
    http.match((r) => r.url === '/cars').forEach((r) => r.flush(page));
    recordRequests().forEach((r) => r.flush(page)); // initial load

    const component = fixture.componentInstance;
    component.onSearchInput('o');
    component.onSearchInput('oi');
    component.onSearchInput('oil');
    tick(SEARCH_DEBOUNCE_MS - 1);
    expect(recordRequests().length).toBe(0);

    tick(1);
    const searches = recordRequests();
    expect(searches.length).toBe(1);
    expect(searches[0].request.params.get('search')).toBe('oil');
    searches[0].flush(page);
    expect(component.loadingEvents).toBeFalse();
  }));
});
