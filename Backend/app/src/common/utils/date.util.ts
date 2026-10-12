/**
 * Adds calendar months in UTC, independent of the server's time zone.
 * Local-time `setMonth` shifts the instant by an hour across DST changes,
 * which moves midnight-UTC dates to the previous day.
 * The day is clamped to the target month's last day (Jan 31 + 1 → Feb 28).
 */
export function addMonthsUtc(date: Date | string, months: number): Date {
  const source = new Date(date);
  const result = new Date(source);
  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + months);
  const lastDay = new Date(
    Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0),
  ).getUTCDate();
  result.setUTCDate(Math.min(source.getUTCDate(), lastDay));
  return result;
}
