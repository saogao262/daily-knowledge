# Daily Knowledge

A daily news and knowledge site that helps you remember what you read. Each day it shows short World and US highlights. Topic pages follow the biggest ongoing stories. A weekly quiz has you put the week's events in order, and questions you miss come back for review until they stick.

**Live:** https://saogao262.github.io/daily-knowledge/ (placeholder page for now). See [PLAN.md](PLAN.md) for progress.

## Tech

TypeScript + Vite, hosted on GitHub Pages. Headlines update daily through a scheduled GitHub Action; quizzes and topic pages are written weekly and stored in this repo.

## Running locally

```bash
npm install
npm run dev
```

Run the tests with `npm test`. Every push to `main` is tested, built, and published to GitHub Pages automatically.
