
/**
 * Warning window: not overdue, but due within this many km.
 */
export const DUE_SOON_KM = 1_000;

/**
 * Warning window: not overdue, but due within this many days.
 */
export const DUE_SOON_DAYS = 30;

/**
 * Upcoming window: maintenance is outside the warning window,
 * but due within this many km or days.
 */
export const UPCOMING_KM = 5_000;
export const UPCOMING_DAYS = 90;

export enum MaintenanceStatus {
  OVERDUE = 'OVERDUE',
  DUE_SOON = 'DUE_SOON',
  UPCOMING = 'UPCOMING',
  HEALTHY = 'HEALTHY',
  NO_SCHEDULE = 'NO_SCHEDULE',
}

export type MaintenanceStatusValue = `${MaintenanceStatus}`;

/**
 * Classify maintenance based on the remaining km and days
 * until the next maintenance thresholds.
 *
 * - OVERDUE: Either configured threshold has been reached or passed.
 * - DUE_SOON: Not overdue, but either threshold is within its warning window.
 * - UPCOMING: Not due soon, but either threshold is within the upcoming window.
 * - HEALTHY: A schedule exists, but all configured thresholds are beyond
 *   the upcoming windows.
 * - NO_SCHEDULE: Neither a mileage nor a date threshold exists.
 *
 * If both mileage and time are configured, whichever threshold is reached
 * first determines the status.
 */
export function classifyMaintenanceStatus(
  remainingKm: number | null,
  remainingDays: number | null,
): MaintenanceStatus {
  const hasKm = remainingKm !== null;
  const hasDays = remainingDays !== null;

  if (!hasKm && !hasDays) {
    return MaintenanceStatus.NO_SCHEDULE;
  }

  // Highest priority: either threshold is due or overdue.
  const isOverdue =
    (hasKm && remainingKm <= 0) || (hasDays && remainingDays <= 0);

  if (isOverdue) {
    return MaintenanceStatus.OVERDUE;
  }

  // Either configured threshold is within the warning window.
  const isDueSoon =
    (hasKm && remainingKm <= DUE_SOON_KM) ||
    (hasDays && remainingDays <= DUE_SOON_DAYS);

  if (isDueSoon) {
    return MaintenanceStatus.DUE_SOON;
  }

  // Either configured threshold is within the upcoming window.
  const isUpcoming =
    (hasKm && remainingKm <= UPCOMING_KM) ||
    (hasDays && remainingDays <= UPCOMING_DAYS);

  if (isUpcoming) {
    return MaintenanceStatus.UPCOMING;
  }

  return MaintenanceStatus.HEALTHY;
}

/**
 * Default sort priority for the maintenance dashboard.
 * Lower values appear first.
 */
export const STATUS_URGENCY: Record<MaintenanceStatusValue, number> = {
  OVERDUE: 1,
  DUE_SOON: 2,
  UPCOMING: 3,
  HEALTHY: 4,
  NO_SCHEDULE: 5,
};
