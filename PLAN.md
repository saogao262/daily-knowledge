# PLAN.md

Short, dated entries. Newest first within each section.

## The app

A daily news and knowledge site that makes you remember, not just read. Each day it shows short **World** and **US** highlights pulled automatically from a news API, each one linking to its source. **Topic pages** follow 4–6 major ongoing stories (for example the Ukraine war and Israel–Palestine) with background, a timeline of key dates, and the latest highlights. A **weekly quiz** (a timeline round where you order the week's events, plus a few multiple-choice questions) tests what you saw. **Spaced repetition** brings back the questions you missed until they stick. Static TypeScript + Vite site on GitHub Pages. A scheduled GitHub Action updates the headlines every day, and the agent writes the quiz and topic updates weekly for Amy to skim.

**Why (Amy, 2026-10-27):** "I think I lack a lot of general knowledge, including history, current events, politics, geography etc. I want a fun easy daily sort of thing that will solve this."

Inspired by this quote: "I think AI is currently creating two categories of students. The first one being the ones that use it to learn everything. The second one being the ones that use it to never learn anything ever again. The second group is much bigger."

So the app should push toward the first group. Amy should actually learn and remember things, which means recalling answers, not just reading them. It should also stay fun and easy enough to do every day.

## Done

- 2026-10-27: Rethought the first milestone around the news ideas (daily highlights, topic pages, weekly quiz, spaced repetition), replacing the daily timeline game.
- 2026-10-27: Design step 1: surveyed 12 similar sites for effectiveness, engagement, speed, and usage data. Written up in `docs/research.md`.
- 2026-10-27: Project set up. Idea, content source, platform, and first milestone decided. CLAUDE.md, PLAN.md, IDEAS.md, README.md, and .gitignore written.

## Next

First milestone: **news, topics, quiz, and review, live** (about 3–4 sessions; something useful is live after each step)
1. Scaffold the Vite + TypeScript app with Vitest, and add a GitHub Actions workflow that deploys to GitHub Pages.
2. Pick the news API. Candidates are The Guardian Open Platform and NYT Top Stories (both have free keys). Check that their terms allow showing headlines and links on a public site.
3. Daily headlines job: a scheduled GitHub Action fetches World and US top stories and commits them as a dated JSON file. The key is stored as a GitHub secret. The job has tests for parsing the API response.
4. Home page: today's World and US highlights (about 5 each, with a one-line summary and source link) and a friendly fallback when today's file is missing. **First live checkpoint.**
5. Topics: the agent proposes 4–6 topics with reasons, and Amy approves. Each topic page gets a "how we got here" background, a key-dates timeline, and the highlights tagged with that topic.
6. Weekly quiz: the content schema plus a content check test, a timeline round ordering the week's events, and 3–5 multiple-choice questions, each followed by a short explanation. It also has a score, a share button, and a weekly streak. The agent writes the first week's quiz.
7. Spaced repetition: missed questions come back on the home page as a short "review" after 3 days, 1 week, 2 weeks, and 1 month. Progress is saved in `localStorage`. Unit tests cover the scheduling.
8. Phone-width and keyboard pass, then open the live link.

## Decisions

- 2026-10-27: **Topics: the agent proposes 4–6 major ongoing stories with reasons, and Amy approves or swaps them.** The list is reviewed monthly. Alternatives considered: Amy picks every topic, or topics are chosen automatically by how often they appear in headlines.
- 2026-10-27: **The timeline game becomes the weekly quiz's main round** instead of a separate daily history game. That means one game to build, tied to the news. Replaces the "daily timeline game" decision below.
- 2026-10-27: **News content is mixed.** Daily headlines come automatically from a news API through a scheduled GitHub Action, with the key kept as a GitHub secret and never shipped to the browser. The weekly quiz and topic updates are written by the agent and skimmed by Amy, so quiz facts are checked. Alternatives considered: a weekly batch written entirely by hand (news up to a week old), and daily AI-written summaries (costs money each day and goes live unchecked, which is risky for contested topics). Replaces the "content is written ahead" decision below for news. History and background are still written ahead.
- 2026-10-27: **Agent instructions live in `AGENTS.md`**, so Codex and Claude Code read the same file. `CLAUDE.md` is just `@AGENTS.md`.
- 2026-10-27: ~~Daily format is a timeline game with mixed topics.~~ (Replaced, see above.) Amy finds articles dull and wants something that feels like a game or a conversation. Alternatives considered: a 5-question quiz, a lesson card plus quiz, a "What am I?" mystery with clues, and a map guess.
- 2026-10-27: ~~Content is written ahead in repo data files.~~ (Replaced for news, see above.)
- 2026-10-27: **Platform is TypeScript + Vite on GitHub Pages**, deployed by GitHub Actions. Vite `base` must match the repo name (`/daily-knowledge/`).
- 2026-10-27: **No accounts or backend.** The streak, quiz results, and review schedule live in `localStorage`, so progress is per device and browser.
- 2026-10-27: **"Today" uses the player's local date.** US news is the default country for now.

## Problems

(none yet)
