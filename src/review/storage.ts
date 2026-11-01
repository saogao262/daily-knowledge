import type { ReviewStore } from './schedule';

const KEY = 'dk.review.v1';

// Like quiz results, review progress is a convenience: if storage is blocked, review still works for the visit.
export function loadReview(): ReviewStore {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function saveReview(store: ReviewStore): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    // Ignore: nothing to save to.
  }
}
