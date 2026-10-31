import { describe, expect, it } from 'vitest';
import type { FeedItem, Leaning, Source } from '../../src/news/types.ts';
import { groupStories, keywords, passesCrossCheck, sameStory, topStories } from './group.ts';

function source(id: string, leaning: Leaning, bias: number, reliability = 40): Source {
  return {
    id,
    name: id.toUpperCase(),
    leaning,
    adFontes: { bias, reliability, label: '' },
    feeds: { world: '', us: '' },
    attribution: id.toUpperCase(),
    paywall: id === 'left2',
    domains: [`${id}.example`],
  };
}

const sources = [
  source('left1', 'left', -5),
  source('left2', 'left', -7),
  source('center1', 'center', -1),
  source('center2', 'center', -2),
  source('right1', 'right', 11),
];

let n = 0;
function item(sourceId: string, headline: string, section: 'world' | 'us' = 'world', hour = 12): FeedItem {
  n++;
  return { sourceId, section, headline, url: `https://${sourceId}.example/${n}`, publishedAt: `2026-10-31T${String(hour).padStart(2, '0')}:00:00.000Z` };
}

describe('keywords and sameStory', () => {
  it('matches headlines about the same event worded differently', () => {
    const a = keywords('Russia strikes Ukraine power grid ahead of winter');
    const b = keywords('Russian strikes hit Ukrainian power grid');
    expect(sameStory(a, b)).toBe(true);
  });

  it('does not match unrelated headlines that share one word', () => {
    const a = keywords('Senate passes bridge repair bill');
    const b = keywords('Senate candidate concedes in Ohio race');
    expect(sameStory(a, b)).toBe(false);
  });

  it('ignores filler words', () => {
    expect([...keywords('What to know about the new rules')]).toEqual(['know', 'rules']);
  });
});

describe('passesCrossCheck', () => {
  it('needs 2+ outlets with 2+ different leanings', () => {
    expect(passesCrossCheck(['left', 'center'])).toBe(true);
    expect(passesCrossCheck(['center', 'right'])).toBe(true);
    expect(passesCrossCheck(['left', 'left'])).toBe(false);
    expect(passesCrossCheck(['center'])).toBe(false);
    expect(passesCrossCheck([])).toBe(false);
  });
});

describe('groupStories', () => {
  it('keeps a story covered by different leanings and leads with the most central headline', () => {
    const stories = groupStories(
      [
        item('left1', 'Central bank holds interest rates steady as inflation cools'),
        item('center1', 'Central bank keeps interest rates unchanged'),
        item('right1', 'Interest rates stay put at central bank meeting'),
      ],
      sources,
    );
    expect(stories).toHaveLength(1);
    expect(stories[0].headline).toBe('Central bank keeps interest rates unchanged');
    expect(stories[0].leanings).toEqual(['left', 'center', 'right']);
    expect(stories[0].outlets.map((o) => o.sourceId)).toEqual(['left1', 'center1', 'right1']);
  });

  it('drops a story only one side reported', () => {
    const stories = groupStories(
      [item('left1', 'Heat wave breaks records across southern Europe'), item('left2', 'Southern Europe heat wave breaks records')],
      sources,
    );
    expect(stories).toEqual([]);
  });

  it('drops a story only one outlet reported', () => {
    expect(groupStories([item('center1', 'Storm makes landfall on Gulf Coast')], sources)).toEqual([]);
  });

  it('keeps one headline per outlet, the newest', () => {
    const stories = groupStories(
      [
        item('center1', 'Storm makes landfall on Gulf Coast', 'us', 9),
        item('center1', 'Storm makes landfall on Gulf Coast, thousands lose power', 'us', 15),
        item('right1', 'Gulf Coast storm makes landfall', 'us', 10),
      ],
      sources,
    );
    expect(stories[0].outlets).toHaveLength(2);
    expect(stories[0].outlets.find((o) => o.sourceId === 'center1')?.headline).toContain('thousands lose power');
  });

  it('puts a story in the section most of its headlines came from', () => {
    const stories = groupStories(
      [
        item('left1', 'Storm makes landfall on Gulf Coast', 'us'),
        item('center1', 'Gulf Coast storm makes landfall', 'us'),
        item('right1', 'Storm makes landfall along Gulf Coast', 'world'),
      ],
      sources,
    );
    expect(stories[0].section).toBe('us');
  });

  it('ignores items from outlets that are not on the list', () => {
    const stories = groupStories(
      [item('center1', 'Storm makes landfall on Gulf Coast'), item('unknown', 'Storm makes landfall on Gulf Coast')],
      sources,
    );
    expect(stories).toEqual([]);
  });
});

describe('topStories', () => {
  it('ranks by leanings, then outlets, and caps the list', () => {
    const stories = groupStories(
      [
        item('left1', 'Trade ministers meet on shipping costs'),
        item('center1', 'Shipping costs top trade ministers meeting'),
        item('left1', 'Malaria vaccine approved by regulator'),
        item('center1', 'Regulator approves malaria vaccine'),
        item('right1', 'New malaria vaccine wins regulator approval'),
      ],
      sources,
    );
    const top = topStories(stories, 'world', 1);
    expect(top).toHaveLength(1);
    expect(top[0].headline).toBe('Regulator approves malaria vaccine');
  });
});
