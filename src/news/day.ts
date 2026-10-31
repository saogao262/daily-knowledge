import type { DayFile, Leaning, Story } from './types';

const LEANING_NAMES: Record<Leaning, string> = { left: 'Left', center: 'Center', right: 'Right' };

export function leaningName(leaning: Leaning): string {
  return LEANING_NAMES[leaning];
}

// Which saved day to show: today's file if it exists, otherwise the newest one before today.
export function pickDate(dates: string[], today: string): string | null {
  const usable = dates.filter((d) => d <= today).sort();
  return usable.length ? usable[usable.length - 1] : null;
}

// The saved days from the last `days` days up to today, newest first (for topic pages' "This week").
export function recentDates(dates: string[], today: string, days = 7): string[] {
  const [y, m, d] = today.split('-').map(Number);
  const start = new Date(Date.UTC(y, m - 1, d - (days - 1))).toISOString().slice(0, 10);
  return dates.filter((date) => date >= start && date <= today).sort().reverse();
}

// Label for the button that opens a story's outlet list, e.g. "Show 3 outlets · Left, Center, Right".
export function outletsLabel(story: Story, open: boolean): string {
  const count = story.outlets.length;
  const sides = story.leanings.map(leaningName).join(', ');
  return `${open ? 'Hide' : 'Show'} ${count} ${count === 1 ? 'outlet' : 'outlets'} · ${sides}`;
}

// The page's own date in YYYY-MM-DD, matching how the job names files (US Central time).
export function centralToday(now: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

// "2026-10-30" -> "Friday, October 30", read as a calendar date (no time zone shift).
export function longDate(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

const LEANINGS = new Set(['left', 'center', 'right']);

function isHttpsUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

function isStory(value: any): value is Story {
  return (
    value &&
    typeof value.id === 'string' &&
    typeof value.headline === 'string' &&
    Array.isArray(value.leanings) &&
    value.leanings.every((l: unknown) => LEANINGS.has(l as string)) &&
    Array.isArray(value.outlets) &&
    value.outlets.every(
      (o: any) =>
        o &&
        typeof o.name === 'string' &&
        typeof o.headline === 'string' &&
        LEANINGS.has(o.leaning) &&
        typeof o.paywall === 'boolean' &&
        isHttpsUrl(o.url),
    )
  );
}

// The day file is built from outside feeds, so check its shape before the page trusts it.
// Stories that don't fit are dropped instead of breaking the whole page.
export function readDayFile(value: any): DayFile | null {
  if (!value || typeof value.date !== 'string' || !Array.isArray(value.world) || !Array.isArray(value.us)) return null;
  return {
    date: value.date,
    generatedAt: String(value.generatedAt ?? ''),
    sources: Array.isArray(value.sources) ? value.sources : [],
    world: value.world.filter(isStory),
    us: value.us.filter(isStory),
  };
}
