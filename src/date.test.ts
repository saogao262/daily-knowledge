import { describe, expect, it } from 'vitest';
import { formatHeaderDate } from './date';

describe('formatHeaderDate', () => {
  it('shows the weekday, month, and day', () => {
    expect(formatHeaderDate(new Date(2026, 9, 31))).toBe('Saturday, October 31');
  });

  it('uses the local calendar day, not UTC', () => {
    // 11:30 pm local time is still the same local day, whatever the UTC date is.
    expect(formatHeaderDate(new Date(2026, 0, 1, 23, 30))).toBe('Thursday, January 1');
  });
});
