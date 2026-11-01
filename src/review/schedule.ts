import type { QuizResult } from '../quiz/types';

// Days until the next review at each stage. A right answer moves an item up a stage,
// a wrong one sends it back to the start. After the 1-month review it's learned.
export const INTERVALS = [3, 7, 14, 30];

export interface ReviewItem {
  key: string; // `${quizId}:${itemId}`
  quizId: string;
  itemId: string;
  stage: number; // index into INTERVALS of the wait that led to `due`
  due: string; // YYYY-MM-DD (US Central)
  learned: boolean;
}

export type ReviewStore = Record<string, ReviewItem>;

export function addDays(date: string, days: number): string {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

export function itemKey(quizId: string, itemId: string): string {
  return `${quizId}:${itemId}`;
}

// Adds every missed quiz item that isn't being reviewed yet, due 3 days after the quiz was finished.
// Safe to run on every page load: items already in the store are left alone.
export function addMissed(store: ReviewStore, results: QuizResult[], toCentralDate: (iso: string) => string): ReviewStore {
  const next = { ...store };
  for (const result of results) {
    const finished = toCentralDate(result.finishedAt);
    for (const itemId of result.missed) {
      const key = itemKey(result.quizId, itemId);
      if (!next[key]) next[key] = { key, quizId: result.quizId, itemId, stage: 0, due: addDays(finished, INTERVALS[0]), learned: false };
    }
  }
  return next;
}

// Oldest due first, so nothing waits forever behind newer items.
export function dueItems(store: ReviewStore, today: string): ReviewItem[] {
  return Object.values(store)
    .filter((item) => !item.learned && item.due <= today)
    .sort((a, b) => a.due.localeCompare(b.due) || a.key.localeCompare(b.key));
}

export function answer(item: ReviewItem, right: boolean, today: string): ReviewItem {
  if (!right) return { ...item, stage: 0, due: addDays(today, INTERVALS[0]) };
  const stage = item.stage + 1;
  if (stage >= INTERVALS.length) return { ...item, stage, learned: true };
  return { ...item, stage, due: addDays(today, INTERVALS[stage]) };
}

// When the next review comes up, for the "all caught up" message.
export function nextDueDate(store: ReviewStore, today: string): string | null {
  const upcoming = Object.values(store)
    .filter((item) => !item.learned && item.due > today)
    .map((item) => item.due)
    .sort();
  return upcoming[0] ?? null;
}

// "in 3 days", "in 1 week", "in 2 weeks", "in 1 month".
export function waitLabel(days: number): string {
  if (days === 7) return 'in 1 week';
  if (days === 14) return 'in 2 weeks';
  if (days === 30) return 'in 1 month';
  return `in ${days} days`;
}
