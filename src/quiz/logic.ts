import type { Quiz, QuizEvent, QuizResult } from './types';

// The newest quiz published on or before today (quizzes come out on Saturdays).
export function currentQuiz(quizzes: Quiz[], today: string): Quiz | null {
  const ready = quizzes.filter((q) => q.id <= today).sort((a, b) => a.id.localeCompare(b.id));
  return ready.length ? ready[ready.length - 1] : null;
}

export function sortByDate(events: QuizEvent[]): QuizEvent[] {
  return [...events].sort((a, b) => a.date.localeCompare(b.date));
}

// Placing a card in gap `gap` of the sorted timeline (0 = before everything) is right
// when it falls after the card before the gap and before the card after it.
export function isPlacementRight(timeline: QuizEvent[], gap: number, card: QuizEvent): boolean {
  const before = timeline[gap - 1];
  const after = timeline[gap];
  return (!before || before.date < card.date) && (!after || card.date < after.date);
}

export function totalItems(quiz: Quiz): number {
  return quiz.cards.length + quiz.questions.length;
}

// Consecutive weekly quizzes finished, counting back from the newest one.
// The current week doesn't break the streak until it's over, so an unfinished
// current quiz just isn't counted yet.
export function weekStreak(quizzes: Quiz[], results: Record<string, QuizResult>, currentId: string): number {
  const ids = quizzes
    .map((q) => q.id)
    .filter((id) => id <= currentId)
    .sort()
    .reverse();
  let streak = 0;
  for (const [i, id] of ids.entries()) {
    if (results[id]) streak++;
    else if (i === 0) continue;
    else break;
  }
  return streak;
}

// "Oct 24–30" or "Oct 31–Nov 6".
export function weekLabel(quiz: Quiz): string {
  const fmt = (d: string, opts: Intl.DateTimeFormatOptions) => {
    const [y, m, day] = d.split('-').map(Number);
    return new Date(y, m - 1, day).toLocaleDateString('en-US', opts);
  };
  const sameMonth = quiz.weekStart.slice(0, 7) === quiz.weekEnd.slice(0, 7);
  return `${fmt(quiz.weekStart, { month: 'short', day: 'numeric' })}–${fmt(quiz.weekEnd, sameMonth ? { day: 'numeric' } : { month: 'short', day: 'numeric' })}`;
}

// Blue and orange squares match the right/wrong colors and are easy to tell apart.
export function shareText(quiz: Quiz, right: boolean[], streak: number, url: string): string {
  const score = right.filter(Boolean).length;
  const timeline = right.slice(0, quiz.cards.length).map((r) => (r ? '🟦' : '🟧')).join('');
  const questions = right.slice(quiz.cards.length).map((r) => (r ? '🟦' : '🟧')).join('');
  const lines = [`Daily Knowledge quiz · Week of ${weekLabel(quiz)}`, `${score}/${right.length}`, `Timeline ${timeline}`, `Questions ${questions}`];
  if (streak > 1) lines.push(`${streak}-week streak`);
  lines.push(url);
  return lines.join('\n');
}

export function missedIds(quiz: Quiz, right: boolean[]): string[] {
  const ids = [...quiz.cards.map((c) => c.id), ...quiz.questions.map((q) => q.id)];
  return ids.filter((_, i) => right[i] === false);
}
