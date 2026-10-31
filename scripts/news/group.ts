import type { Coverage, FeedItem, Leaning, Section, Source, Story } from '../../src/news/types.ts';

// Common words that say nothing about which story a headline is about.
const STOPWORDS = new Set(
  ('a an and are as at be been but by for from has have he her his how in into is it its new news no not of on or ' +
    'our over says said she so than that the their them they this to up us was we were what when where which who ' +
    'why will with after amid about against more most out could would can may just now one two first after before ' +
    'live latest update updates video watch here what\'s year years day days week report reports')
    .split(' '),
);

// Turns a headline into a set of word stems. Cutting words to 5 letters lets
// "Russia"/"Russian" and "strikes"/"striking" match without a real stemmer.
export function keywords(headline: string): Set<string> {
  const words = headline
    .toLowerCase()
    .replace(/['’]s\b/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
  return new Set(words.map((w) => w.slice(0, 5)));
}

// Two headlines describe the same story when they share at least 2 stems and
// those stems make up at least 40% of the shorter headline.
export const MIN_SHARED = 2;
export const MIN_OVERLAP = 0.4;

export function sameStory(a: Set<string>, b: Set<string>): boolean {
  let shared = 0;
  for (const w of a) if (b.has(w)) shared++;
  const smaller = Math.min(a.size, b.size);
  return shared >= MIN_SHARED && smaller > 0 && shared / smaller >= MIN_OVERLAP;
}

// The cross-check: 2 or more outlets, with at least 2 different leanings among them.
export function passesCrossCheck(leanings: Leaning[]): boolean {
  return leanings.length >= 2 && new Set(leanings).size >= 2;
}

function storyId(url: string): string {
  let hash = 0;
  for (const ch of url) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  return (hash >>> 0).toString(36);
}

const LEANING_ORDER: Leaning[] = ['left', 'center', 'right'];

// Picks the headline shown on the card: the most central outlet, then the most reliable.
function leadOutlet(outlets: Coverage[], byId: Map<string, Source>): Coverage {
  return [...outlets].sort((x, y) => {
    const sx = byId.get(x.sourceId)!;
    const sy = byId.get(y.sourceId)!;
    return Math.abs(sx.adFontes.bias) - Math.abs(sy.adFontes.bias) || sy.adFontes.reliability - sx.adFontes.reliability;
  })[0];
}

export function groupStories(items: FeedItem[], sources: Source[]): Story[] {
  const byId = new Map(sources.map((s) => [s.id, s]));
  const known = items.filter((i) => byId.has(i.sourceId));
  const words = known.map((i) => keywords(i.headline));

  // Union-find: every pair of matching headlines from different outlets joins one group.
  const parent = known.map((_, i) => i);
  const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  for (let i = 0; i < known.length; i++) {
    for (let j = i + 1; j < known.length; j++) {
      if (known[i].sourceId !== known[j].sourceId && sameStory(words[i], words[j])) {
        parent[find(i)] = find(j);
      }
    }
  }

  const groups = new Map<number, FeedItem[]>();
  known.forEach((item, i) => {
    const root = find(i);
    groups.set(root, [...(groups.get(root) ?? []), item]);
  });

  const stories: Story[] = [];
  for (const group of groups.values()) {
    // One headline per outlet: keep its newest one for this story.
    const perOutlet = new Map<string, FeedItem>();
    for (const item of group) {
      const current = perOutlet.get(item.sourceId);
      if (!current || item.publishedAt > current.publishedAt) perOutlet.set(item.sourceId, item);
    }

    const outlets: Coverage[] = [...perOutlet.values()].map((item) => {
      const s = byId.get(item.sourceId)!;
      return {
        sourceId: s.id,
        name: s.attribution,
        leaning: s.leaning,
        headline: item.headline,
        url: item.url,
        paywall: s.paywall,
        publishedAt: item.publishedAt,
      };
    });
    if (!passesCrossCheck(outlets.map((o) => o.leaning))) continue;

    outlets.sort((x, y) => LEANING_ORDER.indexOf(x.leaning) - LEANING_ORDER.indexOf(y.leaning) || x.name.localeCompare(y.name));
    const sectionVotes = group.filter((i) => i.section === 'us').length;
    const section: Section = sectionVotes > group.length / 2 ? 'us' : 'world';
    const lead = leadOutlet(outlets, byId);

    stories.push({
      id: storyId(lead.url),
      section,
      headline: lead.headline,
      leanings: LEANING_ORDER.filter((l) => outlets.some((o) => o.leaning === l)),
      outlets,
    });
  }
  return stories;
}

// Most widely covered first: more leanings, then more outlets, then the newest.
export function topStories(stories: Story[], section: Section, limit = 5): Story[] {
  const newest = (s: Story) => s.outlets.reduce((m, o) => (o.publishedAt > m ? o.publishedAt : m), '');
  return stories
    .filter((s) => s.section === section)
    .sort((a, b) => b.leanings.length - a.leanings.length || b.outlets.length - a.outlets.length || newest(b).localeCompare(newest(a)))
    .slice(0, limit);
}
