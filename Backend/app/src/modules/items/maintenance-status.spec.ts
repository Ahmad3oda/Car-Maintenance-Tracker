import {
  classifyMaintenanceStatus,
  MaintenanceStatus,
} from './maintenance-status';

describe('classifyMaintenanceStatus', () => {
  it('is overdue when mileage has passed the due km', () => {
    expect(classifyMaintenanceStatus(-500, 40)).toBe(MaintenanceStatus.OVERDUE);
  });

  it('is overdue when today is past the due date', () => {
    expect(classifyMaintenanceStatus(2000, -3)).toBe(MaintenanceStatus.OVERDUE);
  });

  it('is due soon when within 1,000 km and not overdue', () => {
    expect(classifyMaintenanceStatus(700, 90)).toBe(MaintenanceStatus.DUE_SOON);
  });

  it('is due soon when within 30 days and not overdue', () => {
    expect(classifyMaintenanceStatus(4000, 20)).toBe(
      MaintenanceStatus.DUE_SOON,
    );
  });

  it('is upcoming when a future due exists outside the warning window', () => {
    expect(classifyMaintenanceStatus(4000, 90)).toBe(
      MaintenanceStatus.UPCOMING,
    );
  });

  it('is no schedule when neither km nor date is set', () => {
    expect(classifyMaintenanceStatus(null, null)).toBe(
      MaintenanceStatus.NO_SCHEDULE,
    );
  });
});
