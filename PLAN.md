# PLAN.md

Short, dated entries. Newest first within each section.

## The app

A daily timeline game for general knowledge. Each day: one anchor card plus 5 event cards from mixed topics (history, science, geography, inventions, current events). Place each card on the timeline and get an instant reveal with a short "why it matters" note. Score out of 5, a shareable emoji result, and a daily streak. Static TypeScript + Vite site on GitHub Pages, with content written ahead in repo data files.

**Why (Amy, 2026-10-27):** "I think I lack a lot of general knowledge, including history, current events, politics, geography etc. I want a fun easy daily sort of thing that will solve this."

Inspired by this quote: "I think AI is currently creating two categories of students. The first one being the ones that use it to learn everything. The second one being the ones that use it to never learn anything ever again. The second group is much bigger."

So the app should push toward the first group. Amy should actually learn and remember things, which means recalling answers, not just reading them. It should also stay fun and easy enough to do every day.

## Done

- 2026-10-27: Design step 1: surveyed 12 similar sites for effectiveness, engagement, speed, and usage data. Written up in `docs/research.md`.
- 2026-10-27: Project set up. Idea, content source, platform, and first milestone decided. CLAUDE.md, PLAN.md, IDEAS.md, README.md, and .gitignore written.

## Next

First milestone: **playable + live**
1. Scaffold the Vite + TypeScript app with Vitest, and add a GitHub Actions workflow that deploys to GitHub Pages.
2. Define the content schema and write a content check test.
3. Game logic: pick today's puzzle by local date, check placements, score, streak, share text (with unit tests).
4. Timeline UI: anchor card, tap-to-place gaps, per-card reveal, end screen with score, share button, and streak.
5. Write 14 days of content (Claude drafts, Amy skims).
6. Phone-width and keyboard pass, then deploy and open the live link.

## Decisions

- 2026-10-27: **Agent instructions live in `AGENTS.md`**, so Codex and Claude Code read the same file. `CLAUDE.md` is just `@AGENTS.md`.

- 2026-10-27: **Daily format is a timeline game with mixed topics.** Amy finds articles dull and wants something that feels like a game or a conversation. A timeline fits every topic, because anything with a date works. Alternatives considered: a 5-question quiz, a lesson card plus quiz, a "What am I?" mystery with clues, and a map guess.
- 2026-10-27: **Content is written ahead in repo data files.** It's free, works on static hosting, and every fact can be checked. Current-events cards come in weekly batches of settled facts. Live AI generation (needs a server and a secret key) and news or Wikipedia APIs (quality varies) were set aside.
- 2026-10-27: **Platform is TypeScript + Vite on GitHub Pages**, deployed by GitHub Actions. Vite `base` must match the repo name (`/daily-knowledge/`).
- 2026-10-27: **No accounts or backend.** The streak and results live in `localStorage`, so progress is per device and browser.
- 2026-10-27: **"Today" uses the player's local date**, so the puzzle changes at their own midnight.

## Problems

(none yet)
