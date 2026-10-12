import { addMonthsUtc } from '../../common/utils/date.util';

export interface ScheduleRecord {
  id: number;
  maintenanceDate: Date | string;
  kmCounter: number;
}

export interface ScheduleItem {
  installedDate?: Date | string | null;
  installedKm?: number | null;
  expectedMaintenanceKm?: number | null;
  expectedMaintenanceMonths?: number | null;
}

export interface MaintenanceSchedule {
  lastMaintenanceId: number | null;
  lastMaintenanceDate: Date | null;
  nextMaintenanceKm: number | null;
  nextMaintenanceDate: Date | null;
}

/**
 * Latest record by date; same-day ties go to the higher km, then the newer id.
 */
export function pickLatestRecord<T extends ScheduleRecord>(
  records: T[] | null | undefined,
): T | undefined {
  let latest: T | undefined;
  for (const record of records ?? []) {
    if (!latest || compareRecords(record, latest) > 0) {
      latest = record;
    }
  }
  return latest;
}

function compareRecords(a: ScheduleRecord, b: ScheduleRecord): number {
  return (
    new Date(a.maintenanceDate).getTime() -
      new Date(b.maintenanceDate).getTime() ||
    Number(a.kmCounter) - Number(b.kmCounter) ||
    a.id - b.id
  );
}

function positive(value: number | null | undefined): number | null {
  const n = Number(value);
  return value !== null && value !== undefined && n > 0 ? n : null;
}

/**
 * Next service is measured from the latest record, or from installation when
 * the item has no records.
 */
export function computeMaintenanceSchedule(
  item: ScheduleItem,
  records: ScheduleRecord[] | null | undefined,
): MaintenanceSchedule {
  const latest = pickLatestRecord(records);
  const intervalKm = positive(item.expectedMaintenanceKm);
  const intervalMonths = positive(item.expectedMaintenanceMonths);

  const baseKm = latest ? Number(latest.kmCounter) : item.installedKm;
  const baseDate = latest ? latest.maintenanceDate : item.installedDate;

  return {
    lastMaintenanceId: latest?.id ?? null,
    lastMaintenanceDate: latest ? new Date(latest.maintenanceDate) : null,
    nextMaintenanceKm:
      intervalKm !== null && baseKm !== null && baseKm !== undefined
        ? Number(baseKm) + intervalKm
        : null,
    nextMaintenanceDate:
      intervalMonths !== null && baseDate
        ? addMonthsUtc(baseDate, intervalMonths)
        : null,
  };
}
