import { el } from '../news/render';
import { isPlacementRight, missedIds, shareText, sortByDate, totalItems, weekLabel, weekStreak } from './logic';
import { loadResults, saveResult } from './storage';
import type { Quiz, QuizEvent } from './types';

type Stage = 'intro' | 'timeline' | 'questions' | 'results';

interface State {
  stage: Stage;
  placed: QuizEvent[]; // on the timeline, sorted by date
  cardIndex: number;
  cardReveal: { right: boolean; card: QuizEvent } | null;
  questionIndex: number;
  picked: number | null;
  right: boolean[];
  shared: string | null;
}

function dayName(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function sourceLink(url: string): HTMLAnchorElement {
  const a = el('a', 'quiz-source', 'Source');
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  return a;
}

function button(label: string, className: string, onClick: () => void): HTMLButtonElement {
  const b = el('button', className, label);
  b.type = 'button';
  b.addEventListener('click', onClick);
  return b;
}

export function mountQuiz(root: HTMLElement, quizzes: Quiz[], quiz: Quiz | null, siteUrl: string): void {
  if (!quiz) {
    root.replaceChildren(el('p', 'quiz-eyebrow', 'Weekly quiz'), el('h1', undefined, 'First quiz coming soon'), el('p', 'lede', 'A new quiz on the week’s news comes out every Saturday.'));
    return;
  }
  const q = quiz;
  const saved = loadResults()[q.id];

  const fresh = (): State => ({ stage: 'intro', placed: [q.anchor], cardIndex: 0, cardReveal: null, questionIndex: 0, picked: null, right: [], shared: null });
  let state: State = saved ? { ...fresh(), stage: 'results', right: saved.right } : fresh();

  function set(patch: Partial<State>): void {
    state = { ...state, ...patch };
    draw();
    // Keep keyboard and screen-reader users at the new content.
    root.querySelector<HTMLElement>('[data-focus]')?.focus();
  }

  function header(step: string): HTMLElement {
    return el('p', 'quiz-eyebrow', step);
  }

  function intro(): HTMLElement[] {
    const rounds = el('div', 'quiz-rounds');
    const round = (n: string, name: string, detail: string) => {
      const box = el('div', 'quiz-round');
      const text = el('span', 'quiz-round-text');
      text.append(el('strong', undefined, name), el('span', undefined, detail));
      box.append(el('span', 'quiz-round-num', n), text);
      return box;
    };
    rounds.append(round('1', 'Timeline', `Put ${q.cards.length} of the week's events in order`), round('2', 'Quick questions', `${q.questions.length} multiple-choice questions`));
    const title = el('h1', undefined, 'Weekly quiz');
    title.tabIndex = -1;
    title.dataset.focus = '';
    return [
      header(`Week of ${weekLabel(q)}`),
      title,
      el('p', 'lede', 'How much of this week’s news stuck? About 4 minutes.'),
      rounds,
      button('Start quiz', 'quiz-primary', () => set({ stage: 'timeline' })),
    ];
  }

  function timeline(): HTMLElement[] {
    const card = q.cards[state.cardIndex];
    const out: HTMLElement[] = [header(`Round 1 · Timeline · Card ${state.cardIndex + 1} of ${q.cards.length}`)];

    if (!state.cardReveal) {
      const prompt = el('div', 'quiz-current');
      const title = el('p', 'quiz-current-title', card.title);
      prompt.append(el('p', 'quiz-current-label', 'Where does this go?'), title);
      prompt.tabIndex = -1;
      prompt.dataset.focus = '';
      out.push(prompt);
    } else {
      const { right, card: c } = state.cardReveal;
      const reveal = el('div', `quiz-reveal ${right ? 'is-right' : 'is-wrong'}`);
      const heading = el('p', 'quiz-reveal-title', right ? `✓ Correct! It happened ${dayName(c.date)}.` : `✗ Not quite. It happened ${dayName(c.date)}, so it moved to its spot.`);
      heading.tabIndex = -1;
      heading.dataset.focus = '';
      const last = state.cardIndex === q.cards.length - 1;
      reveal.append(
        heading,
        el('p', 'quiz-reveal-why', c.why),
        sourceLink(c.source),
        button(last ? 'On to the questions' : 'Next card', 'quiz-primary quiz-next', () =>
          set(last ? { stage: 'questions', cardReveal: null } : { cardIndex: state.cardIndex + 1, cardReveal: null }),
        ),
      );
      out.push(reveal);
    }

    const list = el('ol', 'quiz-timeline');
    list.setAttribute('aria-label', 'Timeline, earliest at the top');
    const gap = (i: number) => {
      const li = el('li');
      const label = i === 0 ? 'Place here (earliest)' : i === state.placed.length ? 'Place here (latest)' : 'Place here';
      const b = button(label, 'quiz-gap', () => {
        const right = isPlacementRight(state.placed, i, card);
        set({ placed: sortByDate([...state.placed, card]), cardReveal: { right, card }, right: [...state.right, right] });
      });
      if (i > 0 && i < state.placed.length) b.setAttribute('aria-label', `Place between ${state.placed[i - 1].title} and ${state.placed[i].title}`);
      li.append(b);
      return li;
    };
    const asking = !state.cardReveal;
    state.placed.forEach((e, i) => {
      if (asking) list.append(gap(i));
      const isNew = state.cardReveal?.card.id === e.id;
      const li = el('li', `quiz-event${isNew ? (state.cardReveal!.right ? ' is-right' : ' is-wrong') : ''}`);
      li.append(el('span', 'quiz-event-date', dayName(e.date)), el('span', 'quiz-event-title', e.title));
      list.append(li);
    });
    if (asking) list.append(gap(state.placed.length));
    out.push(list);
    return out;
  }

  function questions(): HTMLElement[] {
    const item = q.questions[state.questionIndex];
    const title = el('h2', 'quiz-question', item.prompt);
    title.tabIndex = -1;
    if (state.picked === null) title.dataset.focus = '';
    const out: HTMLElement[] = [header(`Round 2 · Question ${state.questionIndex + 1} of ${q.questions.length}`), title];

    const options = el('div', 'quiz-options');
    item.options.forEach((text, i) => {
      let cls = 'quiz-option';
      let note = '';
      if (state.picked !== null && i === item.answer) {
        cls += ' is-right';
        note = 'Correct';
      } else if (state.picked !== null && i === state.picked) {
        cls += ' is-wrong';
        note = 'Your answer';
      }
      const b = button(text, cls, () => {
        if (state.picked !== null) return;
        set({ picked: i, right: [...state.right, i === item.answer] });
      });
      b.disabled = state.picked !== null;
      if (note) b.append(el('span', 'quiz-option-note', note));
      options.append(b);
    });
    out.push(options);

    if (state.picked !== null) {
      const right = state.picked === item.answer;
      const last = state.questionIndex === q.questions.length - 1;
      const reveal = el('div', `quiz-reveal ${right ? 'is-right' : 'is-wrong'}`);
      const heading = el('p', 'quiz-reveal-title', right ? '✓ Correct!' : '✗ Not quite.');
      heading.tabIndex = -1;
      heading.dataset.focus = '';
      reveal.append(
        heading,
        el('p', 'quiz-reveal-why', item.explanation),
        sourceLink(item.source),
        button(last ? 'See results' : 'Next question', 'quiz-primary quiz-next', () => {
          if (last) {
            saveResult({ quizId: q.id, right: state.right, missed: missedIds(q, state.right), finishedAt: new Date().toISOString() });
            set({ stage: 'results', picked: null });
          } else {
            set({ questionIndex: state.questionIndex + 1, picked: null });
          }
        }),
      );
      out.push(reveal);
    }
    return out;
  }

  function results(): HTMLElement[] {
    const score = state.right.filter(Boolean).length;
    const total = totalItems(q);
    const streak = weekStreak(quizzes, loadResults(), q.id);

    const card = el('div', 'quiz-score');
    const big = el('p', 'quiz-score-big', `${score} / ${total}`);
    big.tabIndex = -1;
    big.dataset.focus = '';
    const squares = el('div', 'quiz-squares');
    squares.setAttribute('role', 'img');
    squares.setAttribute('aria-label', `${score} of ${total} right`);
    for (const r of state.right) squares.append(el('span', `quiz-square ${r ? 'is-right' : 'is-wrong'}`));
    card.append(big, el('p', 'quiz-score-caption', score === total ? 'Perfect week!' : score >= total * 0.7 ? 'Nice work this week.' : 'Good start. These will stick next time.'), squares);
    if (streak > 0) card.append(el('p', 'quiz-streak', `${streak}-week streak`));

    const missed = total - score;
    const note = el(
      'p',
      'quiz-note',
      missed === 0 ? 'Nothing to review. Everything stuck!' : `You missed ${missed}. They're saved so they can come back for review.`,
    );

    const share = button(state.shared ?? 'Share result', 'quiz-primary', async () => {
      const text = shareText(q, state.right, streak, siteUrl);
      try {
        if (navigator.share) {
          await navigator.share({ text });
          return;
        }
        await navigator.clipboard.writeText(text);
        set({ shared: 'Copied! Paste it anywhere' });
      } catch {
        // The share sheet was closed or clipboard access was refused; leave the button as is.
      }
    });

    return [
      header(`Week of ${weekLabel(q)}`),
      card,
      share,
      note,
      button('Play again', 'quiz-secondary', () => set(fresh())),
    ];
  }

  function draw(): void {
    const parts = state.stage === 'intro' ? intro() : state.stage === 'timeline' ? timeline() : state.stage === 'questions' ? questions() : results();
    root.replaceChildren(...parts);
  }

  draw();
}
