import { describe, expect, it } from 'vitest';
import type { QuizResult } from '../quiz/types';
import { addDays, addMissed, answer, dueItems, nextDueDate, waitLabel, type ReviewItem, type ReviewStore } from './schedule';

const result = (quizId: string, missed: string[], finishedAt = '2026-10-31T18:00:00Z'): QuizResult => ({ quizId, right: [], missed, finishedAt });
const central = (iso: string) => iso.slice(0, 10);

describe('addDays', () => {
  it('crosses month and year boundaries', () => {
    expect(addDays('2026-10-31', 3)).toBe('2026-11-03');
    expect(addDays('2026-12-30', 7)).toBe('2027-01-06');
  });
});

describe('addMissed', () => {
  it('schedules missed items 3 days after the quiz', () => {
    const store = addMissed({}, [result('2026-10-31', ['intel-plunge', 'israel-election'])], central);
    expect(Object.keys(store)).toEqual(['2026-10-31:intel-plunge', '2026-10-31:israel-election']);
    expect(store['2026-10-31:intel-plunge']).toMatchObject({ stage: 0, due: '2026-11-03', learned: false });
  });

  it('leaves items already being reviewed alone', () => {
    const first = addMissed({}, [result('q', ['a'])], central);
    const moved: ReviewStore = { 'q:a': { ...first['q:a'], stage: 2, due: '2026-12-01' } };
    expect(addMissed(moved, [result('q', ['a'])], central)['q:a'].stage).toBe(2);
  });
});

describe('answer', () => {
  const item: ReviewItem = { key: 'q:a', quizId: 'q', itemId: 'a', stage: 0, due: '2026-11-03', learned: false };

  it('walks up 3 days → 1 week → 2 weeks → 1 month, then marks it learned', () => {
    let it1 = answer(item, true, '2026-11-03');
    expect(it1).toMatchObject({ stage: 1, due: '2026-11-10' });
    it1 = answer(it1, true, '2026-11-10');
    expect(it1).toMatchObject({ stage: 2, due: '2026-11-24' });
    it1 = answer(it1, true, '2026-11-24');
    expect(it1).toMatchObject({ stage: 3, due: '2026-12-24' });
    it1 = answer(it1, true, '2026-12-24');
    expect(it1.learned).toBe(true);
  });

  it('sends a wrong answer back to 3 days', () => {
    expect(answer({ ...item, stage: 2 }, false, '2026-11-24')).toMatchObject({ stage: 0, due: '2026-11-27' });
  });
});

describe('dueItems and nextDueDate', () => {
  const store: ReviewStore = {
    'q:a': { key: 'q:a', quizId: 'q', itemId: 'a', stage: 0, due: '2026-11-03', learned: false },
    'q:b': { key: 'q:b', quizId: 'q', itemId: 'b', stage: 1, due: '2026-11-01', learned: false },
    'q:c': { key: 'q:c', quizId: 'q', itemId: 'c', stage: 0, due: '2026-11-10', learned: false },
    'q:d': { key: 'q:d', quizId: 'q', itemId: 'd', stage: 4, due: '2026-10-01', learned: true },
  };

  it('lists unlearned items due by today, oldest first', () => {
    expect(dueItems(store, '2026-11-03').map((i) => i.itemId)).toEqual(['b', 'a']);
  });

  it('finds the next upcoming review', () => {
    expect(nextDueDate(store, '2026-11-03')).toBe('2026-11-10');
    expect(nextDueDate({}, '2026-11-03')).toBeNull();
  });
});

describe('waitLabel', () => {
  it('names each interval', () => {
    expect([3, 7, 14, 30].map(waitLabel)).toEqual(['in 3 days', 'in 1 week', 'in 2 weeks', 'in 1 month']);
  });
});
