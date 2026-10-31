import { describe, expect, it } from 'vitest';
import { centralDate } from './fetch-headlines.ts';

describe('centralDate', () => {
  it('uses the US Central calendar day, not UTC', () => {
    // 3 am UTC on Nov 1 is still the evening of Oct 31 in Chicago.
    expect(centralDate(new Date('2026-11-01T03:00:00Z'))).toBe('2026-10-31');
    expect(centralDate(new Date('2026-11-01T12:00:00Z'))).toBe('2026-11-01');
  });
});
