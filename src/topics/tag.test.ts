import { describe, expect, it } from 'vitest';
import type { Story } from '../news/types';
import content from '../content/topics.json';
import { formatKeyDate, storyMatchesTopic, topicsForStory } from './tag';
import type { TopicList } from './types';

const { topics } = content as TopicList;
const byId = (id: string) => topics.find((t) => t.id === id)!;

function story(headlines: string[], section: 'world' | 'us' = 'world'): Story {
  return {
    id: 'x',
    section,
    headline: headlines[0],
    leanings: ['left', 'center'],
    outlets: headlines.map((h, i) => ({
      sourceId: `s${i}`,
      name: `Outlet ${i}`,
      leaning: i === 0 ? 'left' : 'center',
      headline: h,
      url: `https://example.com/${i}`,
      paywall: false,
      publishedAt: '2026-10-31T00:00:00Z',
    })),
  };
}

describe('topic tagging', () => {
  it('tags real headlines from Oct 31 with the right topics', () => {
    const ukraine = story(['Ukrainian evacuees reunite with family after years trapped in Russia-occupied city']);
    expect(topicsForStory(ukraine, topics).map((t) => t.id)).toEqual(['russia-ukraine']);

    const midterms = story(["What's at stake for Trump in the US midterms?"], 'us');
    expect(topicsForStory(midterms, topics).map((t) => t.id)).toContain('us-midterms');

    const crypto = story(['Crypto firm Binance covers 90% of losses after $6.3bn hack']);
    expect(topicsForStory(crypto, topics).map((t) => t.id)).toEqual(['ai-tech']);
  });

  it('matches whole words only', () => {
    expect(storyMatchesTopic(story(['Officials said the plan will move ahead']), byId('ai-tech'))).toBe(false);
    expect(storyMatchesTopic(story(['Federal judge blocks new rule']), byId('us-economy'))).toBe(false);
    expect(storyMatchesTopic(story(['New AI rules proposed']), byId('ai-tech'))).toBe(true);
  });

  it("doesn't tag a story just for naming the Wall Street Journal", () => {
    const s = story(["Judge dismisses Trump's lawsuit against Wall Street Journal over Epstein birthday book"]);
    expect(storyMatchesTopic(s, byId('us-economy'))).toBe(false);
  });

  it('checks every outlet headline, not just the lead', () => {
    const s = story(['Police deployed during stand-off', 'Netanyahu responds to standoff']);
    expect(storyMatchesTopic(s, byId('israel-palestine'))).toBe(true);
  });

  it('keeps US-only topics out of world stories', () => {
    expect(storyMatchesTopic(story(['Voters head to the polls in Brazil'], 'world'), byId('us-midterms'))).toBe(false);
    expect(storyMatchesTopic(story(['Voters head to the polls in Ohio'], 'us'), byId('us-midterms'))).toBe(true);
  });

  it('handles curly apostrophes', () => {
    expect(storyMatchesTopic(story(['A tight governor’s race in Kansas'], 'us'), byId('us-midterms'))).toBe(true);
  });
});

describe('formatKeyDate', () => {
  it('shows only the precision we have', () => {
    expect(formatKeyDate('2022-02-24')).toBe('Feb 24, 2022');
    expect(formatKeyDate('2026-09')).toBe('September 2026');
    expect(formatKeyDate('1948')).toBe('1948');
  });
});
