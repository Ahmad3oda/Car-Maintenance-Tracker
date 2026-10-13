import {
  computeMaintenanceSchedule,
  pickLatestRecord,
} from './maintenance-schedule.util';

const rec = (id: number, date: string, km: number) => ({
  id,
  maintenanceDate: new Date(date),
  kmCounter: km,
});

describe('pickLatestRecord', () => {
  it('picks the latest date', () => {
    const records = [rec(1, '2026-03-01', 9000), rec(2, '2026-05-01', 1000)];
    expect(pickLatestRecord(records)?.id).toBe(2);
  });

  it('breaks same-day ties by the higher km, regardless of insert order', () => {
    const records = [rec(5, '2026-05-01', 60000), rec(6, '2026-05-01', 55000)];
    expect(pickLatestRecord(records)?.id).toBe(5);
  });

  it('breaks full ties by the newer id', () => {
    const records = [rec(8, '2026-05-01', 100), rec(3, '2026-05-01', 100)];
    expect(pickLatestRecord(records)?.id).toBe(8);
  });

  it('returns undefined for no records', () => {
    expect(pickLatestRecord([])).toBeUndefined();
    expect(pickLatestRecord(undefined)).toBeUndefined();
  });
});

describe('computeMaintenanceSchedule', () => {
  const item = {
    installedDate: new Date('2026-01-01T00:00:00.000Z'),
    installedKm: 40000,
    expectedMaintenanceKm: 5000,
    expectedMaintenanceMonths: 6,
  };

  it('measures from the latest record', () => {
    const schedule = computeMaintenanceSchedule(item, [
      rec(1, '2026-01-01T00:00:00.000Z', 40000),
      rec(2, '2026-04-01T00:00:00.000Z', 44000),
    ]);
    expect(schedule).toEqual({
      lastMaintenanceId: 2,
      lastMaintenanceDate: new Date('2026-04-01T00:00:00.000Z'),
      nextMaintenanceKm: 49000,
      nextMaintenanceDate: new Date('2026-10-01T00:00:00.000Z'),
    });
  });

  it('falls back to installation values without records', () => {
    expect(computeMaintenanceSchedule(item, [])).toEqual({
      lastMaintenanceId: null,
      lastMaintenanceDate: null,
      nextMaintenanceKm: 45000,
      nextMaintenanceDate: new Date('2026-07-01T00:00:00.000Z'),
    });
  });

  it('clears next values when intervals are missing or zero', () => {
    const schedule = computeMaintenanceSchedule(
      { ...item, expectedMaintenanceKm: 0, expectedMaintenanceMonths: null },
      [rec(1, '2026-01-01', 40000)],
    );
    expect(schedule.nextMaintenanceKm).toBeNull();
    expect(schedule.nextMaintenanceDate).toBeNull();
  });
});
