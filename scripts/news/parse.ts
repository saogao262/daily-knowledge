import { XMLParser } from 'fast-xml-parser';
import type { FeedItem, Section, Source } from '../../src/news/types.ts';

const MAX_HEADLINE_LENGTH = 300;

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@',
  processEntities: true,
  htmlEntities: true,
  // Feeds sometimes have one <item>; always get an array so the code below has one shape.
  isArray: (name) => name === 'item' || name === 'entry',
});

// Feed text is untrusted: turn whatever the XML holds into one plain line.
function toText(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (typeof value === 'object' && '#text' in value) return toText((value as { '#text': unknown })['#text']);
  return '';
}

const NAMED_ENTITIES: Record<string, string> = { amp: '&', apos: "'", quot: '"', lt: '<', gt: '>', nbsp: ' ' };

// Some feeds escape twice (&amp;apos;), so the parser leaves entities behind. Decode them, twice to cover that.
function decodeEntities(text: string): string {
  let out = text;
  for (let pass = 0; pass < 2; pass++) {
    out = out
      .replace(/&#(\d+);/g, (_, n: string) => String.fromCodePoint(Number(n)))
      .replace(/&#x([0-9a-f]+);/gi, (_, n: string) => String.fromCodePoint(parseInt(n, 16)))
      .replace(/&([a-z]+);/gi, (m, name: string) => NAMED_ENTITIES[name.toLowerCase()] ?? m);
  }
  return out;
}

export function cleanHeadline(raw: string): string {
  return decodeEntities(raw)
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_HEADLINE_LENGTH);
}

// Only keep links to the outlet's own site, so a tampered feed can't point readers elsewhere.
export function safeUrl(raw: string, domains: string[]): string | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
  const host = url.hostname.toLowerCase();
  const allowed = domains.some((d) => host === d || host.endsWith('.' + d));
  if (!allowed) return null;
  url.protocol = 'https:';
  return url.toString();
}

function linkOf(entry: Record<string, unknown>): string {
  const link = entry.link;
  if (typeof link === 'string') return link;
  // Atom: <link href="..."/>, possibly several.
  const links = Array.isArray(link) ? link : [link];
  for (const l of links) {
    if (l && typeof l === 'object' && '@href' in l) return String((l as { '@href': unknown })['@href']);
    const text = toText(l);
    if (text) return text;
  }
  return '';
}

export function parseFeed(xml: string, source: Source, section: Section): FeedItem[] {
  const doc = parser.parse(xml) as Record<string, any>;
  const entries: Record<string, unknown>[] = doc?.rss?.channel?.item ?? doc?.feed?.entry ?? doc?.['rdf:RDF']?.item ?? [];

  const items: FeedItem[] = [];
  for (const entry of entries) {
    const headline = cleanHeadline(toText(entry.title));
    const url = safeUrl(linkOf(entry), source.domains);
    const dateText = toText(entry.pubDate ?? entry['dc:date'] ?? entry.published ?? entry.updated);
    const time = Date.parse(dateText);
    if (!headline || !url || Number.isNaN(time)) continue;
    items.push({ sourceId: source.id, section, headline, url, publishedAt: new Date(time).toISOString() });
  }
  return items;
}
