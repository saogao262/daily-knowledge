import { describe, expect, it } from 'vitest';
import content from '../content/quizzes.json';
import type { QuizList } from '../quiz/types';
import { reviewQuestion } from './questions';

const quiz = (content as QuizList).quizzes[0];

describe('reviewQuestion', () => {
  it('turns a missed timeline card into a "when did this happen?" question', () => {
    const q = reviewQuestion(quiz, 'intel-plunge', 'Oct 24–30')!;
    expect(q.prompt).toContain('Intel');
    expect(q.options).toHaveLength(4);
    expect(new Set(q.options).size).toBe(4);
    expect(q.options[q.answer]).toBe('Fri, Oct 30');
    expect(q.from).toBe('From the quiz for Oct 24–30');
  });

  it('keeps multiple-choice questions as they were', () => {
    const q = reviewQuestion(quiz, 'world-series', 'Oct 24–30')!;
    expect(q.options[q.answer]).toBe('Milwaukee Brewers');
  });

  it('returns null for an id that no longer exists', () => {
    expect(reviewQuestion(quiz, 'gone', 'Oct 24–30')).toBeNull();
  });

  it('works for every card and question in the content', () => {
    for (const id of [...quiz.cards.map((c) => c.id), ...quiz.questions.map((x) => x.id)]) {
      const q = reviewQuestion(quiz, id, 'x')!;
      expect(q.options).toHaveLength(4);
      expect(q.answer).toBeGreaterThanOrEqual(0);
    }
  });
});
