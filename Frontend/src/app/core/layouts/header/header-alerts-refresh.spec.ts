import { TestBed, discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ALERTS_REFRESH_MS, HeaderComponent } from './header.component';
import { DashboardService } from '../../services/dashboard.service';
import { AlertsRefreshService } from '../../services/alerts-refresh.service';

describe('HeaderComponent alert refresh', () => {
  let loads: number;

  beforeEach(() => {
    loads = 0;
    const dashboard = {
      getDueAlertsSummary: () => {
        loads++;
        return of({ overdue: 0, dueSoon: 0, totalDue: loads, items: [] });
      },
    };
    TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: DashboardService, useValue: dashboard },
      ],
    });
  });

  it('loads alerts on start and again every minute', fakeAsync(() => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    expect(loads).toBe(1);

    tick(ALERTS_REFRESH_MS);
    expect(loads).toBe(2);
    tick(ALERTS_REFRESH_MS);
    expect(loads).toBe(3);
    expect(fixture.componentInstance.dueAlerts.totalDue).toBe(3);

    fixture.destroy();
    tick(ALERTS_REFRESH_MS);
    expect(loads).toBe(3); // stops after the header is gone (logout)
  }));

  it('reloads once, shortly after a burst of data changes', fakeAsync(() => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    const alerts = TestBed.inject(AlertsRefreshService);

    alerts.notifyChanged();
    alerts.notifyChanged();
    alerts.notifyChanged();
    tick(300);
    expect(loads).toBe(2);

    fixture.destroy();
    discardPeriodicTasks();
  }));
});
