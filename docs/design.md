# Design: screens and flow

Design step 2, 2026-10-30. Clickable sketches: https://claude.ai/artifact/7LgmLShzdeMWfMo43M4pCB (private to Amy). The source is in `docs/sketches/`. `Main.dc.html` has every screen, and its `look` setting switches between the two styles. Those files only run inside the claude.ai design canvas, so read them for layout and wording.

**Status: approved 2026-10-30.** The look and all screens are approved as sketched. Build to this document. Any change to a screen gets recorded under Changes requested first.

## Look (decided 2026-10-30: look 1)

Amy chose **look 1, calm news + playful quiz**. Look 2 stays on the canvas only for reference. The two looks were:

1. **Calm news + playful quiz.**
   - The Today and Topics screens look like a clean newspaper: Source Serif 4 headlines, Inter body text, white background, navy accent, and thin dividers between stories.
   - The quiz and review use a warmer, game-like style: Nunito, a cream background, an orange accent, rounded cards, and big pill buttons.
2. **Friendly game everywhere.** Nunito, cream, and rounded white cards on every screen, with a teal accent on the news screens.

Shared in both looks:
- Right answers are shown in blue and wrong ones in orange. Each is always labeled with a word ("Correct", "Your answer", "Not quite"), so color is never the only signal.
- Tap targets are at least 44px tall.

## Navigation

The bottom tab bar has **Today**, **Topics**, and **Quiz**. Topic pages open from the Topics list, and a back button returns to the list.

## Screens

**Today**
- Date and streak at the top.
- A **review card** with one due question. You answer it and then see what was right, a short explanation, and when the question comes back (3 days if missed, 1 week if right).
- **World** and **United States** highlights. Each one shows an optional topic tag, a headline, and a one-line summary.
- A "Show N outlets · Left, Center, Right" button opens the list of outlets that covered the story. Each outlet has its leaning and a link.

**Topics**
- A list of the proposed topics, each with when it was last updated and how many stories are new this week.
- A **topic page** has three parts:
  - "How we got here": 3–4 neutral sentences that cite 2 or more sources.
  - "Key dates": a vertical timeline.
  - "This week": the cross-checked highlights tagged with that topic.

**Quiz** (weekly)
1. **Intro:** the week, about 4 minutes, and the two rounds. A Start button.
2. **Timeline round:**
   - The card to place is shown at the top.
   - Dashed "Place here" slots sit between the cards already on the timeline. The timeline starts with one anchor card.
   - After you tap a slot, you see whether you were right, the date, and a short explanation. The card then moves to its correct spot.
3. **Multiple-choice round:** 4 options. After you answer, the right one is marked, your answer is labeled, and a short explanation and Next button appear.
4. **Results:**
   - Your score, a row of colored squares (also described for screen readers), and your week streak.
   - A Share button.
   - A note saying the questions you missed will come back on the Today page.

## Sample content in the sketches

Everything marked [Sample] is made up, and "Outlet A–D" are placeholders, not real outlets. The few real facts used (the 2014 annexation of Crimea, the February 24, 2022 invasion, the Federal Reserve setting rates, euro cash in 2002) are only there to show the format.

## Approved

- 2026-10-30: All screens as sketched: Today (with the review card and outlet list), Topics, the topic page, and the quiz intro, timeline round, multiple-choice round, and results. The bottom tab bar is approved too.
- 2026-10-30: Look 1, calm news + playful quiz.

## Changes requested

(none yet)
