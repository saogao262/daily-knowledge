import { centralToday } from '../news/day';
import { el } from '../news/render';
import { weekLabel } from '../quiz/logic';
import { loadResults } from '../quiz/storage';
import type { Quiz } from '../quiz/types';
import { reviewQuestion } from './questions';
import { addMissed, answer, dueItems, INTERVALS, nextDueDate, waitLabel, type ReviewItem } from './schedule';
import { loadReview, saveReview } from './storage';

function shortDay(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

function button(label: string, className: string, onClick: () => void): HTMLButtonElement {
  const b = el('button', className, label);
  b.type = 'button';
  b.addEventListener('click', onClick);
  return b;
}

interface Session {
  queue: ReviewItem[]; // due items when the card was opened
  index: number;
  picked: number | null;
  result: ReviewItem | null; // the item after answering, for the "comes back" message
}

// The review card on Today: missed quiz items come back one at a time until none are due.
export function mountReview(root: HTMLElement, quizzes: Quiz[]): { refresh: () => void } {
  let session: Session | null = null;
  const byId = new Map(quizzes.map((q) => [q.id, q]));

  function questionFor(item: ReviewItem) {
    const quiz = byId.get(item.quizId);
    return quiz ? reviewQuestion(quiz, item.itemId, weekLabel(quiz)) : null;
  }

  function refresh(): void {
    // Mid-review, keep the player's place.
    if (session && session.index < session.queue.length) return;
    const today = centralToday(new Date());
    const store = addMissed(loadReview(), Object.values(loadResults()), (iso) => centralToday(new Date(iso)));
    saveReview(store);
    const queue = dueItems(store, today).filter((item) => questionFor(item) !== null);
    session = queue.length ? { queue, index: 0, picked: null, result: null } : null;
    draw();
  }

  function draw(): void {
    if (!session) {
      root.hidden = true;
      root.replaceChildren();
      return;
    }
    root.hidden = false;
    const s = session;

    if (s.index >= s.queue.length) {
      const next = nextDueDate(loadReview(), centralToday(new Date()));
      const done = el('p', 'review-done', next ? `All caught up. Your next review is ${shortDay(next)}.` : 'All caught up. Nothing left to review.');
      done.tabIndex = -1;
      root.replaceChildren(el('p', 'quiz-eyebrow', 'Review'), done);
      done.focus();
      return;
    }

    const item = s.queue[s.index];
    const q = questionFor(item)!;
    const remaining = s.queue.length - s.index;
    const prompt = el('h2', 'review-prompt', q.prompt);
    prompt.tabIndex = -1;

    const options = el('div', 'quiz-options review-options');
    q.options.forEach((text, i) => {
      let cls = 'quiz-option';
      let note = '';
      if (s.picked !== null && i === q.answer) {
        cls += ' is-right';
        note = 'Correct';
      } else if (s.picked !== null && i === s.picked) {
        cls += ' is-wrong';
        note = 'Your answer';
      }
      const b = button(text, cls, () => {
        if (s.picked !== null) return;
        const right = i === q.answer;
        const updated = answer(item, right, centralToday(new Date()));
        saveReview({ ...loadReview(), [updated.key]: updated });
        session = { ...s, picked: i, result: updated };
        draw();
        root.querySelector<HTMLElement>('.quiz-reveal-title')?.focus();
      });
      b.disabled = s.picked !== null;
      if (note) b.append(el('span', 'quiz-option-note', note));
      options.append(b);
    });

    const parts: HTMLElement[] = [
      el('p', 'quiz-eyebrow', `Review · ${remaining} ${remaining === 1 ? 'question' : 'questions'} due`),
      el('p', 'review-from', q.from),
      prompt,
      options,
    ];

    if (s.picked !== null && s.result) {
      const right = s.picked === q.answer;
      const when = s.result.learned ? "You've got this one. It won't come back." : `This comes back ${waitLabel(INTERVALS[s.result.stage])}.`;
      const reveal = el('div', `quiz-reveal ${right ? 'is-right' : 'is-wrong'}`);
      const title = el('p', 'quiz-reveal-title', right ? `✓ Nice. ${when}` : `✗ Not quite. ${when}`);
      title.tabIndex = -1;
      const source = el('a', 'quiz-source', 'Source');
      source.href = q.source;
      source.target = '_blank';
      source.rel = 'noopener noreferrer';
      const last = s.index === s.queue.length - 1;
      reveal.append(
        title,
        el('p', 'quiz-reveal-why', q.explanation),
        source,
        button(last ? 'Done' : 'Next', 'quiz-primary quiz-next', () => {
          session = { ...s, index: s.index + 1, picked: null, result: null };
          draw();
          root.querySelector<HTMLElement>('.review-prompt, .review-done')?.focus();
        }),
      );
      parts.push(reveal);
    }

    root.replaceChildren(...parts);
  }

  refresh();
  return { refresh };
}
