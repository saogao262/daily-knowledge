# News sources

Build step 2, checked 2026-10-31. **Status: approved by Amy on 2026-10-31**: the 7 proposed outlets plus The Economist, which Amy asked to add. The machine-readable list is `data/sources.json`.

## How outlets were chosen
- **Leaning** comes from AllSides: Left or Lean Left counts as left, Center as center, and Lean Right or Right as right.
- **Credibility** comes from Ad Fontes Media. An outlet needs a reliability score of 32 or higher, which Ad Fontes labels "Generally Reliable" or better (their scale runs 0–64). Ad Fontes bias runs from −42 (left) to +42 (right), with −6 to +6 labeled "Middle".
- **A working feed:** each outlet needs a free RSS feed for World and for US news that updated in the last day. All 7 below were checked on 2026-10-31. RSS feeds need no API key, so the daily job needs no secrets.

## Approved list (8 outlets: 3 left, 3 center, 2 right)

| Outlet | Leaning | AllSides | Ad Fontes bias | Ad Fontes reliability | Paywall |
|---|---|---|---|---|---|
| NPR | left | Lean Left | −4.36 (Middle) | 42.69 Reliable | no |
| The New York Times | left | Lean Left (news) | −7.80 (Skews Left) | 40.87 Reliable | yes |
| The Economist | left | Lean Left (medium confidence) | −3.05 (Middle) | 41.37 Reliable | yes |
| BBC News | center | Center | −1.42 (Middle) | 44.60 Reliable | no |
| The Hill | center | Center | −1.54 (Middle) | 41.59 Reliable | no |
| The Christian Science Monitor | center | Center | −2.52 (Middle) | 44.23 Reliable | no |
| Fox News (website) | right | Right | +11.43 (Skews Right) | 33.83 Generally Reliable | no |
| Washington Examiner | right | Lean Right | +11.15 (Skews Right) | 34.19 Generally Reliable | no |

**Balance:** 3 left, 3 center, 2 right. The original proposal was 2 / 3 / 2. Adding The Economist tilts the list one outlet to the left. No other right-leaning outlet with a working free feed passes the credibility bar (see below), so the right side stays at 2. The cross-check rule still needs two different leanings, so no story can pass on left-leaning outlets alone.

**Paywalls:** NYT and The Economist are paywalled. That doesn't affect the cross-check, which only uses headlines. The page will mark paywalled links so it's clear before you tap.

**Known weakness:** the right-leaning outlets that pass the credibility bar score lower on reliability (about 34) than the others (about 41–45). Fewer stories may pass with a right-leaning outlet involved, and the page will show which outlets each story came from.

## Considered but not included
- **The Guardian:** AllSides Left, Ad Fontes −8.51 and 39.54. Credible, but adding it would make the list 3 left and 2 right. A good swap-in if the left side needs more world coverage.
- **Al Jazeera:** AllSides Lean Left (low confidence), Ad Fontes −7.27 and 41.31. Strong world coverage, but AllSides notes it often leaves out right-leaning perspectives, which matters for topics like Israel–Palestine.
- **NewsNation:** AllSides Center, but no Ad Fontes page was found for its website.
- **New York Post:** AllSides Right (news), Ad Fontes 31.00, "Mixed Reliability". Below the credibility bar.
- **Washington Times:** AllSides Lean Right, Ad Fontes 31.31, "Mixed Reliability". Below the credibility bar.
- **Wall Street Journal:** AllSides Center (news), but its public RSS feed stopped updating in January 2025.
- **AP and Reuters:** AllSides Center and widely trusted, but neither offers a free public feed.

## Terms of use (needs a decision)
Most of these outlets offer their RSS feeds for **personal, non-commercial use**, and they ask for clear credit (for example "BBC News") and no use of their logos. NPR's wording is the strictest: personal non-commercial use, or certain non-profits that aren't news organizations. None of them clearly grants permission to show their headlines on a public website.

What keeps this site closest to those terms:
- It stays non-commercial: no ads, no payments.
- It shows only the headline, a link to the original story, and the outlet's name. It never shows article text or logos.
- The one-line summaries are written in our own words, not copied from the outlets' descriptions.

**Decision (Amy, 2026-10-31):** the site stays public but non-commercial, following the three rules above. It's fine to share the link with friends, but don't promote it widely. This is a judgment call, not legal advice.

## Sources
- AllSides ratings: https://www.allsides.com/media-bias (individual pages for The Economist, BBC News, NPR, New York Times, Fox News Digital, The Hill, Christian Science Monitor, NewsNation, RealClearPolitics, Al Jazeera, CBS News)
- Ad Fontes Media outlet pages: https://adfontesmedia.com/npr-bias-and-reliability/, /new-york-times-bias-and-reliability/, /bbc-bias-and-reliability/, /hill-bias-and-reliability/, /christian-science-monitor-bias-and-reliability/, /fox-news-bias-and-reliability/, /washington-examiner-bias-and-reliability/, /the-guardian-bias-and-reliability/, /al-jazeera-bias-and-reliability/, /washington-times-bias-and-reliability/, /new-york-post-bias-and-reliability, /the-economist-bias-and-reliability/
- NPR rights and permissions: https://npr.org/about-npr/179881519/rights-and-permissions-information
- Fox News terms of use: https://www.foxnews.com/story/fox-news-network-l-l-c-terms-of-use-agreement
