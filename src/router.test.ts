import { describe, expect, it } from 'vitest';
import { parseRoute, topicHref } from './router';

describe('parseRoute', () => {
  it('reads each view from the hash', () => {
    expect(parseRoute('')).toEqual({ view: 'today' });
    expect(parseRoute('#/')).toEqual({ view: 'today' });
    expect(parseRoute('#/topics')).toEqual({ view: 'topics' });
    expect(parseRoute('#/topics/russia-ukraine')).toEqual({ view: 'topic', id: 'russia-ukraine' });
    expect(parseRoute('#/quiz')).toEqual({ view: 'quiz' });
  });

  it('falls back to Today for anything unknown', () => {
    expect(parseRoute('#/nope')).toEqual({ view: 'today' });
  });

  it('round-trips topic links', () => {
    expect(parseRoute(topicHref('us-economy'))).toEqual({ view: 'topic', id: 'us-economy' });
  });
});
