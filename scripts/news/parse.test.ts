import { describe, expect, it } from 'vitest';
import type { Source } from '../../src/news/types.ts';
import { cleanHeadline, parseFeed, safeUrl } from './parse.ts';

const source: Source = {
  id: 'test',
  name: 'Test Outlet',
  leaning: 'center',
  adFontes: { bias: 0, reliability: 40, label: '' },
  feeds: { world: '', us: '' },
  attribution: 'Test Outlet',
  paywall: false,
  domains: ['example.com'],
};

const rss = `<?xml version="1.0"?>
<rss version="2.0"><channel><title>Test</title>
  <item>
    <title><![CDATA[ Leaders meet for <b>climate</b> talks ]]></title>
    <link>https://www.example.com/world/climate-talks</link>
    <pubDate>Sat, 31 Oct 2026 16:21:19 EDT</pubDate>
  </item>
  <item>
    <title>Storm &apos;moves&apos; inland</title>
    <link>http://example.com/us/storm</link>
    <pubDate>Sat, 31 Oct 2026 08:00:47 -0400</pubDate>
  </item>
  <item>
    <title>Link to another site</title>
    <link>https://evil.test/phish</link>
    <pubDate>Sat, 31 Oct 2026 08:00:47 -0400</pubDate>
  </item>
  <item>
    <title>No date</title>
    <link>https://example.com/no-date</link>
  </item>
</channel></rss>`;

describe('parseFeed', () => {
  it('reads RSS items into plain headlines with safe links and ISO dates', () => {
    const items = parseFeed(rss, source, 'world');
    expect(items).toEqual([
      {
        sourceId: 'test',
        section: 'world',
        headline: 'Leaders meet for climate talks',
        url: 'https://www.example.com/world/climate-talks',
        publishedAt: '2026-10-31T20:21:19.000Z',
      },
      {
        sourceId: 'test',
        section: 'world',
        headline: "Storm 'moves' inland",
        url: 'https://example.com/us/storm',
        publishedAt: '2026-10-31T12:00:47.000Z',
      },
    ]);
  });

  it('handles a feed with a single item', () => {
    const one = `<rss><channel><item><title>Only one</title><link>https://example.com/a</link><pubDate>Sat, 31 Oct 2026 10:00:00 +0000</pubDate></item></channel></rss>`;
    expect(parseFeed(one, source, 'us')).toHaveLength(1);
  });

  it('reads Atom entries', () => {
    const atom = `<feed xmlns="http://www.w3.org/2005/Atom"><entry><title>Atom story</title><link href="https://example.com/atom"/><updated>2026-10-31T10:00:00Z</updated></entry></feed>`;
    expect(parseFeed(atom, source, 'us')[0]).toMatchObject({ headline: 'Atom story', url: 'https://example.com/atom' });
  });

  it('returns nothing for a feed with no items', () => {
    expect(parseFeed('<rss><channel><title>Empty</title></channel></rss>', source, 'us')).toEqual([]);
  });
});

describe('safeUrl', () => {
  it('rejects other domains, look-alike domains, and non-web links', () => {
    expect(safeUrl('https://example.com.evil.test/x', ['example.com'])).toBeNull();
    expect(safeUrl('https://notexample.com/x', ['example.com'])).toBeNull();
    expect(safeUrl('javascript:alert(1)', ['example.com'])).toBeNull();
    expect(safeUrl('not a url', ['example.com'])).toBeNull();
  });
});

describe('cleanHeadline', () => {
  it('strips tags and extra spaces', () => {
    expect(cleanHeadline('  A <i>big</i>   day  ')).toBe('A big day');
  });

  it('decodes entities, including double-escaped ones', () => {
    expect(cleanHeadline('Sydney Loofe&amp;apos;s friend &#8216;helped&#8217;')).toBe('Sydney Loofe\'s friend ‘helped’');
  });

  it('removes tags that were hidden inside entities', () => {
    expect(cleanHeadline('&lt;script&gt;x&lt;/script&gt;Real headline')).toBe('xReal headline');
  });
});
