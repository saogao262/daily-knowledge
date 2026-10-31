import type { QuizResult } from './types';

const KEY = 'dk.quizResults.v1';

// Storage can be blocked (private mode, strict settings). The quiz still works; it just won't remember.
export function loadResults(): Record<string, QuizResult> {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function saveResult(result: QuizResult): void {
  try {
    const all = loadResults();
    // Keep the first finish of each week, so replays don't change the score or streak.
    if (!all[result.quizId]) {
      all[result.quizId] = result;
      localStorage.setItem(KEY, JSON.stringify(all));
    }
  } catch {
    // Ignore: nothing to save to.
  }
}
