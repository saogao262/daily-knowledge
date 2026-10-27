# Research: similar sites

2026-10-27. This is the first step of the design process: a survey of existing sites that do something similar. Each entry rates **effectiveness** (how well it teaches useful knowledge), **engagement** (how entertaining it is), and **speed** (how long one session takes), plus usage data where any is public. Most sites publish no numbers. Speed figures are estimates based on each game's format.

## Timeline games (closest to our plan)

### 1. Wikipedia "Which came first?" (Wikipedia Android app)
A daily set of 5 questions. Each one shows two events and asks which happened first.
- **Effectiveness:** Good. The events come from Wikipedia's "On this day" pages and link to the articles, but choosing between two is easier than placing a card on a timeline.
- **Engagement:** Moderate. It's short and has a satisfying score, but it's an extra inside an app people open for other reasons.
- **Speed:** About 1–2 minutes.
- **Data (the best data for any game like ours):**
  - 11.7% of the people who saw the prompt started a game.
  - 71.4% of the people who started finished it.
  - About 25% played more than once.
  - Players who engaged returned 7.3% more often, but overall app retention did not go up, so the main goal was missed.
  - 63.6% of drop-off happened on the first question.

### 2. NYT Flashback (New York Times Upshot)
A **weekly** quiz: sort 8 events into date order. Most of the events connect to that week's news.
- **Effectiveness:** The strongest teaching here. Tying history to current news gives a reason to remember it, which is close to our mix of history and current events.
- **Engagement:** Moderate, because it's only weekly and sits behind the NYT brand.
- **Speed:** About 3–5 minutes.
- **Data:** none public.

### 3. Wikitrivia
A free, open-source game that went viral in January 2022. You place cards on an endless timeline until you lose 3 lives.
- **Effectiveness:** Weak. You see a title and a year with almost no explanation, so it trains guessing more than knowledge.
- **Engagement:** Very high. Press compared it to Wordle, and players shared emoji scores.
- **Speed:** Open-ended, often 10 minutes or more. It isn't a daily game.
- **Data:** no player counts, only press coverage from the viral spike.

### 4. Timdle
Daily date-ordering questions. Later questions are worth more points, and you don't need to know exact years.
- **Effectiveness:** OK for getting a sense of the order of events. The review we found doesn't mention explanations after each answer.
- **Engagement:** Good, with rising difficulty and a streak.
- **Speed:** About 3–5 minutes.
- **Data:** none public. The stats page shows only your own games played, streak, and average score.

### 5. Smaller daily timeline games (Chronoodle, Sordit, Sequence, Krono)
Each one orders 5–7 events, usually with 3 tries, and mixes in pop culture and sports.
- **Effectiveness:** Low to moderate, because there's little context and the topics are random.
- **Engagement:** Good, with one shareable puzzle a day.
- **Speed:** 2–4 minutes.
- **Data:** none. These are hobby projects.

## Geography

### 6. Worldle
Guess a country from its outline.
- **Effectiveness:** Great for learning map shapes, but it covers only one narrow skill.
- **Engagement:** High.
- **Speed:** 1–2 minutes.
- **Data:** more than 500,000 players in a single day, a few weeks after launch in 2022. No current numbers.

### 7. Globle
Guess the mystery country, with "hotter or colder" hints on a globe.
- **Effectiveness:** You learn where countries are relative to each other.
- **Engagement:** High.
- **Speed:** 2–4 minutes.
- **Data:** none found.

### 8. GeoGuessr
Guess where in the world a Street View photo was taken.
- **Effectiveness:** Deep geography skill that takes a long time to build.
- **Engagement:** Very high, with a pro esports scene.
- **Speed:** 10 minutes or more, so it isn't a quick daily habit.
- **Data:** the Steam version alone had about 2,700–7,300 people playing at once in 2026. The total player count isn't published.

## Quizzes and news

### 9. Bing News Quiz (Microsoft)
A daily multiple-choice quiz on recent headlines, with short explanations.
- **Effectiveness:** Decent for current events.
- **Engagement:** Mostly driven by Microsoft Rewards points rather than fun.
- **Speed:** About 2 minutes.
- **Data:** none public.

### 10. Sporcle
A huge library of "name all the ___" quizzes.
- **Effectiveness:** Strong for memorizing lists, but it gives little context.
- **Engagement:** High for quiz fans.
- **Speed:** The average visit lasts about 20 minutes.
- **Data:** Sporcle reports 1–1.5 million quizzes played per day and 136 million visits per year.

## Habit benchmarks (not the same kind of site, but they show what keeps people coming back)

### 11. Duolingo
Language learning, included for what it shows about streaks.
- **Effectiveness:** Not comparable to ours.
- **Engagement:** Very high, built around streaks.
- **Speed:** About 5 minutes.
- **Data:**
  - 58.7 million daily users out of 140.6 million monthly users (Q2 2026), so about 42% come back daily.
  - More than 10 million people have a streak of a year or longer.
  - One "streak revival" campaign brought back 15.4 million learners.

### 12. 1440 Daily Digest
A 5-minute email that summarizes the news.
- **Effectiveness:** Weak for remembering, because you only read and never recall anything.
- **Engagement:** Low. It's reading, not a game.
- **Speed:** About 5 minutes.
- **Data:** about 4 million subscribers, with roughly 50–65% opening each day according to sources close to the company. The dates of those figures are unclear.

## What this means for our design
- **Coming back each day is the hard part, not the game.** Wikipedia's test shows people finish a timeline game they've started, but most never return. Duolingo shows that a streak and a reason to come back make the difference.
- **The explanation after each answer turns a guess into learning.** Flashback and the news quizzes have it, and Wikitrivia doesn't. This supports our "why it matters" notes.
- **None of these sites bring back the questions you got wrong.** Seeing a missed fact again a few days later helps it stick. That fits Amy's goal of actually remembering things, and almost nobody else does it.
- **2–5 minutes is the right length** for a daily game.
- **The first question must be easy and inviting.** Most people who quit Wikipedia's game left on question one.

## Sources
- Wikimedia, "Which came first?" project page: https://www.mediawiki.org/wiki/Wikimedia_Apps/Team/Android/TriviaGame
- Mashable via Yahoo, Wikipedia quiz launch: https://www.yahoo.com/lifestyle/articles/wikipedia-introduces-daily-quiz-game-164825695.html
- Wikitrivia on Wikipedia: https://en.wikipedia.org/wiki/Wikitrivia
- Inverse/Input on Wikitrivia: https://www.inverse.com/input/culture/this-wikipedia-trivia-game-is-the-best-thing-since-wordle
- NME on Wikitrivia: https://www.nme.com/news/wikitrivia-is-a-browser-game-where-you-have-to-organise-world-history-3143760
- Gigazine, Timdle review: https://www.gigazine.net/gsc_news/en/20250705-timdle
- Sordit: https://peerpush.com/p/sordit-daily-timeline-game
- Chronoodle: https://oodlegames.itch.io/chronoodle
- Krono: https://www.hunted.space/product/krono-history-pop-culture-trivia/launches/krono
- NYT Flashback (PressReader): https://eeditionnytimes.pressreader.com/article/281608129954524
- KTVU, Worldle 500,000 players in a day: https://www.ktvu.com/news/what-is-worldle-spinoff-map-game-is-like-wordle-but-for-geography-buffs
- Globle: https://sites.google.com/view/globlegame
- GeoGuessr on Wikipedia: https://en.wikipedia.org/wiki/GeoGuessr
- GeoGuessr Steam charts: https://steamcharts.com/app/3478870
- Sporcle partnerships: https://www.sporcle.com/partnerships/
- Semrush, Sporcle traffic: https://tr.semrush.com/website/sporcle.com/overview
- Pulse 2.0, Duolingo Q2 2026: https://pulse2.com/duolingo-daily-active-users-reach-58-7-million-as-retention-hits-record-84-and-social-accounts-top-1-billion-organic-impressions/
- PocketGamer.biz, Duolingo 365-day streaks: https://www.pocketgamer.biz/more-than-10-million-duolingo-users-have-a-365-day-streak
- Email Breakdown, 1440 growth: https://emailbreakdown.beehiiv.com/p/1440-s-growth-lessons-from-4m-readers
- Brown University, 1440: https://entrepreneurship.brown.edu/?p=42335
