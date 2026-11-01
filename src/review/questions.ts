import type { Quiz, QuizEvent } from '../quiz/types';

export interface ReviewQuestion {
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
  source: string;
  from: string; // e.g. "Quiz: week of Oct 24–30"
}

function dayLabel(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

// A missed timeline card comes back as "when did this happen?", with the true date
// and the 3 nearest other event dates from the same week as choices, in date order.
function cardQuestion(quiz: Quiz, card: QuizEvent): Omit<ReviewQuestion, 'from'> {
  const others = [quiz.anchor, ...quiz.cards]
    .filter((e) => e.id !== card.id)
    .sort((a, b) => Math.abs(Date.parse(a.date) - Date.parse(card.date)) - Math.abs(Date.parse(b.date) - Date.parse(card.date)) || a.date.localeCompare(b.date))
    .slice(0, 3)
    .map((e) => e.date);
  const dates = [card.date, ...others].sort();
  return {
    prompt: `When did this happen? “${card.title}”`,
    options: dates.map(dayLabel),
    answer: dates.indexOf(card.date),
    explanation: card.why,
    source: card.source,
  };
}

export function reviewQuestion(quiz: Quiz, itemId: string, weekLabel: string): ReviewQuestion | null {
  const from = `From the quiz for ${weekLabel}`;
  const card = quiz.cards.find((c) => c.id === itemId);
  if (card) return { ...cardQuestion(quiz, card), from };
  const q = quiz.questions.find((x) => x.id === itemId);
  if (q) return { prompt: q.prompt, options: q.options, answer: q.answer, explanation: q.explanation, source: q.source, from };
  return null;
}
