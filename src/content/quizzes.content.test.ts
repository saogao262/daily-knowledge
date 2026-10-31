// Content check: every quiz must be complete, dated inside its week, and sourced.
import { describe, expect, it } from 'vitest';
import content from './quizzes.json';
import type { QuizList } from '../quiz/types';

const { quizzes } = content as QuizList;
const DAY = /^\d{4}-\d{2}-\d{2}$/;
const isHttps = (url: string) => {
  try {
    return new URL(url).protocol === 'https:';
  } catch {
    return false;
  }
};
const weekday = (d: string) => {
  const [y, m, day] = d.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, day)).getUTCDay();
};

describe('quizzes.json', () => {
  it('has unique quiz ids', () => {
    const ids = quizzes.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  for (const quiz of quizzes) {
    describe(quiz.id, () => {
      it('is published on a Saturday and covers the Saturday-to-Friday week before it', () => {
        for (const d of [quiz.id, quiz.weekStart, quiz.weekEnd]) expect(d).toMatch(DAY);
        expect(weekday(quiz.id)).toBe(6);
        expect(weekday(quiz.weekStart)).toBe(6);
        expect(weekday(quiz.weekEnd)).toBe(5);
        expect(quiz.weekEnd < quiz.id).toBe(true);
      });

      it('has an anchor plus 5 cards, all in the week, with distinct dates and sources', () => {
        expect(quiz.cards).toHaveLength(5);
        const events = [quiz.anchor, ...quiz.cards];
        for (const e of events) {
          expect(e.date, e.id).toMatch(DAY);
          expect(e.date >= quiz.weekStart && e.date <= quiz.weekEnd, e.id).toBe(true);
          expect(e.title.length).toBeGreaterThan(0);
          expect(e.why.length).toBeGreaterThan(0);
          expect(isHttps(e.source), e.source).toBe(true);
        }
        expect(new Set(events.map((e) => e.date)).size).toBe(events.length);
      });

      it('has 5 questions with 4 distinct options, a valid answer, an explanation, and a source', () => {
        expect(quiz.questions).toHaveLength(5);
        for (const q of quiz.questions) {
          expect(q.options, q.id).toHaveLength(4);
          expect(new Set(q.options).size).toBe(4);
          expect(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4, q.id).toBe(true);
          expect(q.explanation.length).toBeGreaterThan(0);
          expect(isHttps(q.source), q.source).toBe(true);
        }
      });

      it('uses unique ids for cards and questions (review relies on them)', () => {
        const ids = [quiz.anchor.id, ...quiz.cards.map((c) => c.id), ...quiz.questions.map((q) => q.id)];
        expect(new Set(ids).size).toBe(ids.length);
      });
    });
  }
});
