import { addMonthsUtc } from './date.util';

describe('addMonthsUtc', () => {
  const originalTz = process.env.TZ;

  beforeAll(() => {
    // A zone with DST, where local-time setMonth used to lose an hour.
    process.env.TZ = 'Europe/Berlin';
  });

  afterAll(() => {
    process.env.TZ = originalTz;
  });

  it('keeps the same UTC day across a DST change', () => {
    const result = addMonthsUtc(new Date('2026-01-01T00:00:00.000Z'), 6);
    expect(result.toISOString()).toBe('2026-07-01T00:00:00.000Z');
  });

  it('keeps the same UTC day when leaving DST', () => {
    const result = addMonthsUtc(new Date('2026-07-01T00:00:00.000Z'), 6);
    expect(result.toISOString()).toBe('2027-01-01T00:00:00.000Z');
  });

  it('clamps to the last day of a shorter month', () => {
    expect(addMonthsUtc('2026-01-31T00:00:00.000Z', 1).toISOString()).toBe(
      '2026-02-28T00:00:00.000Z',
    );
    expect(addMonthsUtc('2028-01-31T00:00:00.000Z', 1).toISOString()).toBe(
      '2028-02-29T00:00:00.000Z',
    );
  });

  it('rolls over the year and preserves the time of day', () => {
    expect(addMonthsUtc('2026-11-15T10:30:00.000Z', 3).toISOString()).toBe(
      '2027-02-15T10:30:00.000Z',
    );
  });

  it('does not mutate the input', () => {
    const input = new Date('2026-01-01T00:00:00.000Z');
    addMonthsUtc(input, 6);
    expect(input.toISOString()).toBe('2026-01-01T00:00:00.000Z');
  });
});
