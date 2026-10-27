# AGENTS.md

Instructions for any coding agent working in this repo (Codex, Claude Code, or others). This file is the single source of truth. `CLAUDE.md` only points here. This is Amy's personal project (not coursework).

## Project

**Vision.** A daily general-knowledge game that people come back to every day, like a daily puzzle. Each day is a **timeline game with mixed topics**: 5 event cards drawn from history, science, geography, inventions, and current events. The player places each card on a timeline. After each card is placed, the game shows the right answer with a short, friendly "here's what happened and why it matters" note. The goal is something that feels like a game or a conversation, not an article, and that makes the player recall answers rather than just read them.

**Content.** Written ahead of time and stored as data files in the repo (no live AI, no news API in v1). The agent drafts batches of days, Amy skims them, and the app picks the puzzle for today's date. Current-events cards are written in weekly batches and use only settled, clearly dated facts. Every card has a source link.

**Platform.** TypeScript + Vite, a static site hosted on GitHub Pages and deployed by GitHub Actions on push to `main`. No backend, no accounts. Player progress lives in `localStorage`.

**First milestone: playable + live.** Opening the site shows today's puzzle:
- 1 anchor card with its year shown, then 5 cards to place one at a time (tap a gap on the timeline; works on a phone)
- Each placement is revealed right away: the year, right or wrong, and the "why it matters" note. A wrong card moves to its correct spot.
- End screen with the score out of 5, a "share result" button (copies an emoji line such as `Daily Knowledge #3 🟩🟩🟥🟩🟩`), and the current streak
- 14 days of content, and a friendly message when today has no puzzle
- Live on GitHub Pages from a link

See `PLAN.md` for status and the reasons behind the project, and `IDEAS.md` for parked ideas.

## Student Preferences

- **Explained collaboration.** The agent writes all the code and explains what it does and why, in plain language. Amy does not code by hand.
- **Done first.** Amy says what "done" looks like before asking for a change. If a request has no finish line, ask for one before starting.
- **Long, uninterrupted sessions.** Ask every question in one batch at the start of a task, then work through without stopping to check in.
- **End-of-task wrap-up.** List the choices the agent made that Amy didn't ask for, and give one quick thing to try in the app before committing.
- **Ideas go in IDEAS.md.** Random ideas are written down dated, in Amy's words, and are not built until Amy moves them to **Next** in `PLAN.md`.
- Use they/them for Amy.

## Keeping PLAN.md

- Sections: **The app**, **Done**, **Next**, **Decisions**, **Problems**. Entries are short and dated (`YYYY-MM-DD:`), newest first.
- Update it in the same commit as the work it describes: move finished items from Next to Done, record any non-obvious choice in Decisions with its reason and the alternatives considered, and log bugs or blockers in Problems until they're fixed.
- Only Amy adds items to Next from `IDEAS.md`.

## Conventions

**Code quality**
- TypeScript `strict` mode. Small modules with clear names: game logic (pure functions) is kept separate from rendering (DOM).
- Plain TypeScript and DOM, no UI framework, until there is a real reason to add one (record it in Decisions).
- Few dependencies. Ask before adding a new runtime dependency.
- Comments explain *why*, not *what*.

**Content**
- One data file per day (or one file per batch) with a typed schema. Each card has a title, year (negative for BCE), category, a "why it matters" note of 1–2 sentences, and a source URL.
- No two cards on the same day share a year. Notes are friendly and short. Avoid contested facts and fuzzy dates.

**Testing**
- Vitest for logic: picking the puzzle for a date, placement checking and scoring, streak updates, and share text.
- A content check test that validates every day file (card count, unique years, required fields, source links).
- `npm test` and `npm run build` must pass before any commit. For UI changes, also check by hand in the browser at phone width.

**Usability**
- Mobile first: tap targets of at least 44px, readable without zooming, no horizontal scroll.
- Works with the keyboard alone and has sensible labels for screen readers. Right and wrong are shown with more than color (an icon or a word).
- Respects light and dark mode.

**Security basics**
- No secrets, API keys, or personal data in the repo, ever.
- Render content with `textContent` or DOM APIs, never `innerHTML` with content strings.
- `localStorage` holds only game progress (streak, past results). Wrap reads in try/catch so the game still works when storage is blocked.
- Keep dependencies current, and look at `npm audit` output before adding packages.

**Committing and pushing**
- Small commits with one purpose each and a clear present-tense message (for example "Add streak tracking").
- Commit after Amy has tried the quick check. Pushing to `main` deploys the live site, so push only when the build and tests pass.
