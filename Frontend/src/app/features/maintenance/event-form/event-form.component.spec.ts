import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { EventFormComponent } from './event-form.component';

describe('EventFormComponent', () => {
  let component: EventFormComponent;
  let fixture: ComponentFixture<EventFormComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventFormComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(EventFormComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('adds and removes extra cost rows', () => {
    component.addExtraCost();
    component.addExtraCost();
    expect(component.extraCosts.length).toBe(2);
    component.removeExtraCost(0);
    expect(component.extraCosts.length).toBe(1);
  });

  it('sends numbers, not strings, for km and costs', () => {
    component.eventForm.patchValue({
      maintenanceDate: '2026-03-01',
      kmCounter: '61000',
      itemCost: '45.5',
    });
    component.onSubmit();
    const req = http.expectOne((r) => r.method === 'POST' && r.url === '/maintenance-records');
    expect(req.request.body.kmCounter).toBe(61000);
    expect(req.request.body.itemCost).toBe(45.5);
    req.flush({ id: 1 });
  });
});
