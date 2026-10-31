import { describe, expect, it } from 'vitest';
import { centralToday, longDate, outletsLabel, pickDate, readDayFile } from './day';
import type { Story } from './types';

const story: Story = {
  id: 'a1',
  section: 'world',
  headline: 'Regulator approves malaria vaccine',
  leanings: ['left', 'center', 'right'],
  outlets: [
    { sourceId: 'npr', name: 'NPR', leaning: 'left', headline: 'Malaria vaccine approved', url: 'https://npr.org/a', paywall: false, publishedAt: '2026-10-31T10:00:00Z' },
    { sourceId: 'bbc', name: 'BBC News', leaning: 'center', headline: 'Regulator approves malaria vaccine', url: 'https://bbc.com/a', paywall: false, publishedAt: '2026-10-31T10:00:00Z' },
    { sourceId: 'fox', name: 'Fox News', leaning: 'right', headline: 'New malaria vaccine wins approval', url: 'https://foxnews.com/a', paywall: false, publishedAt: '2026-10-31T10:00:00Z' },
  ],
};

describe('pickDate', () => {
  it("uses today's file when it exists", () => {
    expect(pickDate(['2026-10-29', '2026-10-31', '2026-10-30'], '2026-10-31')).toBe('2026-10-31');
  });

  it('falls back to the newest earlier day', () => {
    expect(pickDate(['2026-10-29', '2026-10-30'], '2026-10-31')).toBe('2026-10-30');
  });

  it('ignores future dates and handles no files', () => {
    expect(pickDate(['2026-11-02'], '2026-10-31')).toBeNull();
    expect(pickDate([], '2026-10-31')).toBeNull();
  });
});

describe('outletsLabel', () => {
  it('names the count and the leanings', () => {
    expect(outletsLabel(story, false)).toBe('Show 3 outlets · Left, Center, Right');
    expect(outletsLabel(story, true)).toBe('Hide 3 outlets · Left, Center, Right');
  });
});

describe('dates', () => {
  it('formats a saved date without shifting the day', () => {
    expect(longDate('2026-10-31')).toBe('Saturday, October 31');
  });

  it("uses Central time for today's date", () => {
    expect(centralToday(new Date('2026-11-01T03:00:00Z'))).toBe('2026-10-31');
  });
});

describe('readDayFile', () => {
  it('keeps good stories and drops ones with unsafe links or missing fields', () => {
    const bad = { ...story, id: 'bad', outlets: [{ ...story.outlets[0], url: 'javascript:alert(1)' }] };
    const day = readDayFile({ date: '2026-10-31', generatedAt: 'x', sources: [], world: [story, bad, { nope: true }], us: [] });
    expect(day?.world.map((s) => s.id)).toEqual(['a1']);
  });

  it('rejects something that is not a day file', () => {
    expect(readDayFile(null)).toBeNull();
    expect(readDayFile({ date: '2026-10-31' })).toBeNull();
  });
});
