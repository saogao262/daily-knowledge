# AGENTS.md

Instructions for any coding agent working in this repo (Codex, Claude Code, or others). This file is the single source of truth. `CLAUDE.md` only points here. This is Amy's personal project (not coursework).

## Project

**Vision.** A daily news and knowledge site that Amy comes back to every day and that makes them *remember*, not just read. It has four parts:
- **Daily highlights.** Short World and US lists, about 5 items each, with a one-line summary and a source link.
- **Topic pages.** 4–6 major ongoing stories (for example the Ukraine war and Israel–Palestine), each with a "how we got here" background, a key-dates timeline, and the latest tagged highlights.
- **Weekly quiz.** A timeline round where you put the week's events in order, plus a few multiple-choice questions, each followed by a short explanation, a score, and a share button.
- **Spaced repetition.** Missed questions come back as a short review on the home page after 3 days, 1 week, 2 weeks, and 1 month.

It should feel like a game or a conversation, not an article.

**Content.**
- Daily headlines are fetched automatically from a news API by a scheduled GitHub Action and committed as dated JSON files.
- The weekly quiz and topic updates are written by the agent, and Amy skims them before they go live.
- The agent proposes the topics with reasons, Amy approves them, and the list is reviewed monthly.
- Every item and question has a source link.

**Platform.** TypeScript + Vite, a static site hosted on GitHub Pages and deployed by GitHub Actions on push to `main`. No backend, no accounts. Player progress (streak, quiz results, review schedule) lives in `localStorage`.

**First milestone: news, topics, quiz, and review, live.** All four parts work on the live GitHub Pages site, with daily headlines updating automatically, 4–6 approved topic pages, one week's quiz, and the review schedule working. The steps are listed in `PLAN.md` under Next.

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
- Every content file has a typed schema and is covered by a content check test. Every highlight, event, and question has a date and a source URL.
- Quiz timeline rounds use events with distinct dates. Explanations are friendly and 1–2 sentences long.
- **Contested topics** (wars, elections, Israel–Palestine, and similar) use neutral wording. State what happened, when, and who says what, and attribute any claim that is disputed. Background sections cite more than one source. Don't take sides, and don't use loaded labels without attributing them.
- Quiz questions ask about facts that are settled and dated, not about opinions or predictions.

**Testing**
- Vitest for logic: parsing news API responses, picking today's and this week's files, quiz scoring, the review schedule, streaks, and share text.
- A content check test that validates every content file (required fields, dates, source links, distinct dates in timeline rounds).
- `npm test` and `npm run build` must pass before any commit. For UI changes, also check by hand in the browser at phone width.

**Usability**
- Mobile first: tap targets of at least 44px, readable without zooming, no horizontal scroll.
- Works with the keyboard alone and has sensible labels for screen readers. Right and wrong are shown with more than color (an icon or a word).
- Respects light and dark mode.

**Security basics**
- No secrets, API keys, or personal data in the repo, ever. The news API key lives only in GitHub Actions secrets and is used only by the scheduled job, never in browser code.
- Treat news API responses as untrusted text: validate them against the schema and render them as plain text.
- Render content with `textContent` or DOM APIs, never `innerHTML` with content strings.
- `localStorage` holds only game progress (streak, past results). Wrap reads in try/catch so the game still works when storage is blocked.
- Keep dependencies current, and look at `npm audit` output before adding packages.

**Committing and pushing**
- Small commits with one purpose each and a clear present-tense message (for example "Add streak tracking").
- Commit after Amy has tried the quick check. Pushing to `main` deploys the live site, so push only when the build and tests pass.
