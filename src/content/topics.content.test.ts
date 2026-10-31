// Content check: every topic must be complete, sourced, and dated before it can go live.
import { describe, expect, it } from 'vitest';
import content from './topics.json';
import type { TopicList } from '../topics/types';

const list = content as TopicList;
const DATE = /^\d{4}(-\d{2}(-\d{2})?)?$/;
const isHttps = (url: string) => {
  try {
    return new URL(url).protocol === 'https:';
  } catch {
    return false;
  }
};

describe('topics.json', () => {
  it('has 4–6 topics with unique ids', () => {
    expect(list.topics.length).toBeGreaterThanOrEqual(4);
    expect(list.topics.length).toBeLessThanOrEqual(6);
    const ids = list.topics.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  for (const topic of list.topics) {
    describe(topic.id, () => {
      it('has a name, an updated date, and 3–4 background paragraphs', () => {
        expect(topic.name.length).toBeGreaterThan(0);
        expect(topic.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(topic.background.length).toBeGreaterThanOrEqual(3);
        expect(topic.background.length).toBeLessThanOrEqual(4);
        for (const p of topic.background) expect(p.trim().length).toBeGreaterThan(20);
      });

      it('cites 2+ https sources for the background', () => {
        expect(topic.sources.length).toBeGreaterThanOrEqual(2);
        for (const s of topic.sources) {
          expect(s.title.length).toBeGreaterThan(0);
          expect(isHttps(s.url), s.url).toBe(true);
        }
      });

      it('has key dates in order, each with text and an https source', () => {
        expect(topic.dates.length).toBeGreaterThanOrEqual(3);
        for (const d of topic.dates) {
          expect(d.date, d.text).toMatch(DATE);
          expect(d.text.length).toBeGreaterThan(0);
          expect(isHttps(d.source), d.source).toBe(true);
        }
        const keys = topic.dates.map((d) => d.date);
        expect([...keys].sort()).toEqual(keys);
      });

      it('has lowercase keywords for tagging', () => {
        expect(topic.keywords.length).toBeGreaterThan(0);
        for (const k of topic.keywords) expect(k).toBe(k.toLowerCase().trim());
      });
    });
  }
});
