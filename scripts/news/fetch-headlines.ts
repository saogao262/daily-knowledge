// Daily headlines job. Run with: node scripts/news/fetch-headlines.ts
// Reads every approved outlet's World and US feeds, groups headlines into stories,
// keeps the ones that pass the cross-check, and writes public/data/headlines/<date>.json.
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import type { DayFile, FeedItem, Section, Source, SourceList, SourceStatus } from '../../src/news/types.ts';
import { groupStories, topStories } from './group.ts';
import { parseFeed } from './parse.ts';

const OUT_DIR = 'public/data/headlines';
const MAX_AGE_HOURS = 36;
const MIN_WORKING_SOURCES = 4;
const SECTIONS: Section[] = ['world', 'us'];

// The site's "today" follows US Central time, where Amy lives.
export function centralDate(now: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'DailyKnowledgeBot/1.0 (+https://saogao262.github.io/daily-knowledge/)' },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

async function readSource(source: Source, since: number): Promise<{ items: FeedItem[]; status: SourceStatus }> {
  const items: FeedItem[] = [];
  const errors: string[] = [];
  for (const section of SECTIONS) {
    try {
      const xml = await fetchText(source.feeds[section]);
      items.push(...parseFeed(xml, source, section).filter((i) => Date.parse(i.publishedAt) >= since));
    } catch (err) {
      errors.push(`${section}: ${(err as Error).message}`);
    }
  }
  const ok = errors.length < SECTIONS.length;
  return { items, status: { id: source.id, ok, items: items.length, ...(errors.length ? { error: errors.join('; ') } : {}) } };
}

async function main(): Promise<void> {
  const { sources } = JSON.parse(await readFile('data/sources.json', 'utf8')) as SourceList;
  const now = new Date();
  const since = now.getTime() - MAX_AGE_HOURS * 3600_000;

  const results = await Promise.all(sources.map((s) => readSource(s, since)));
  const statuses = results.map((r) => r.status);
  const working = statuses.filter((s) => s.ok).length;
  for (const s of statuses) console.log(`${s.ok ? 'ok  ' : 'FAIL'} ${s.id}: ${s.items} recent headlines${s.error ? ` (${s.error})` : ''}`);

  // With too few outlets the cross-check means little, so keep yesterday's file rather than publish a thin one.
  if (working < MIN_WORKING_SOURCES) {
    console.error(`Only ${working} outlets responded (need ${MIN_WORKING_SOURCES}). Not writing a file.`);
    process.exit(1);
  }

  const stories = groupStories(results.flatMap((r) => r.items), sources);
  const day: DayFile = {
    date: centralDate(now),
    generatedAt: now.toISOString(),
    sources: statuses,
    world: topStories(stories, 'world'),
    us: topStories(stories, 'us'),
  };

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(`${OUT_DIR}/${day.date}.json`, JSON.stringify(day, null, 2) + '\n');

  // index.json lists every saved day, newest first, so the site can find today's file or fall back to the latest.
  const dates = (await readdir(OUT_DIR))
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
    .map((f) => f.slice(0, 10))
    .sort()
    .reverse();
  await writeFile(`${OUT_DIR}/index.json`, JSON.stringify({ dates }, null, 2) + '\n');

  console.log(`Wrote ${day.date}: ${day.world.length} world and ${day.us.length} US stories from ${stories.length} that passed the cross-check.`);
}

if (import.meta.main) {
  await main();
}
