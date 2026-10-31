import { describe, expect, it } from 'vitest';
import { currentQuiz, isPlacementRight, missedIds, shareText, sortByDate, weekLabel, weekStreak } from './logic';
import type { Quiz, QuizEvent, QuizResult } from './types';

const ev = (id: string, date: string): QuizEvent => ({ id, date, title: id, why: '', source: 'https://example.com' });

function quiz(id: string, weekStart = '2026-10-24', weekEnd = '2026-10-30'): Quiz {
  return {
    id,
    weekStart,
    weekEnd,
    anchor: ev('anchor', '2026-10-28'),
    cards: [ev('a', '2026-10-30'), ev('b', '2026-10-25')],
    questions: [{ id: 'q1', prompt: '', options: ['a', 'b', 'c', 'd'], answer: 0, explanation: '', source: 'https://example.com' }],
  };
}

const done = (quizId: string): QuizResult => ({ quizId, right: [], missed: [], finishedAt: '' });

describe('currentQuiz', () => {
  it('picks the newest quiz already published', () => {
    const qs = [quiz('2026-10-31'), quiz('2026-11-07'), quiz('2026-10-24')];
    expect(currentQuiz(qs, '2026-11-05')?.id).toBe('2026-10-31');
    expect(currentQuiz(qs, '2026-11-07')?.id).toBe('2026-11-07');
    expect(currentQuiz(qs, '2026-10-01')).toBeNull();
  });
});

describe('isPlacementRight', () => {
  const timeline = sortByDate([ev('mon', '2026-10-26'), ev('wed', '2026-10-28')]);

  it('accepts a card between its neighbors', () => {
    expect(isPlacementRight(timeline, 1, ev('tue', '2026-10-27'))).toBe(true);
  });

  it('accepts the first and last gaps when they fit', () => {
    expect(isPlacementRight(timeline, 0, ev('sun', '2026-10-25'))).toBe(true);
    expect(isPlacementRight(timeline, 2, ev('fri', '2026-10-30'))).toBe(true);
  });

  it('rejects a card in the wrong gap', () => {
    expect(isPlacementRight(timeline, 0, ev('fri', '2026-10-30'))).toBe(false);
    expect(isPlacementRight(timeline, 2, ev('sun', '2026-10-25'))).toBe(false);
  });
});

describe('weekStreak', () => {
  const qs = [quiz('2026-10-17'), quiz('2026-10-24'), quiz('2026-10-31')];

  it('counts consecutive finished weeks back from the newest', () => {
    expect(weekStreak(qs, { '2026-10-31': done('2026-10-31'), '2026-10-24': done('2026-10-24') }, '2026-10-31')).toBe(2);
  });

  it("doesn't break the streak for this week's unfinished quiz", () => {
    expect(weekStreak(qs, { '2026-10-24': done('2026-10-24'), '2026-10-17': done('2026-10-17') }, '2026-10-31')).toBe(2);
  });

  it('stops at a skipped week', () => {
    expect(weekStreak(qs, { '2026-10-31': done('2026-10-31'), '2026-10-17': done('2026-10-17') }, '2026-10-31')).toBe(1);
  });
});

describe('weekLabel', () => {
  it('shortens the month when the week stays in one month', () => {
    expect(weekLabel(quiz('2026-10-31'))).toBe('Oct 24–30');
    expect(weekLabel(quiz('2026-11-07', '2026-10-31', '2026-11-06'))).toBe('Oct 31–Nov 6');
  });
});

describe('share and missed', () => {
  const q = quiz('2026-10-31');
  const right = [true, false, true];

  it('builds share text with the score and colored squares', () => {
    expect(shareText(q, right, 3, 'https://x.test')).toBe(
      'Daily Knowledge quiz · Week of Oct 24–30\n2/3\nTimeline 🟦🟧\nQuestions 🟦\n3-week streak\nhttps://x.test',
    );
  });

  it('leaves out a 1-week streak', () => {
    expect(shareText(q, right, 1, 'https://x.test')).not.toContain('streak');
  });

  it('lists the ids answered wrong', () => {
    expect(missedIds(q, right)).toEqual(['b']);
  });
});
