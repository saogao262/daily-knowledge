// Formats a date the way the Today header shows it, e.g. "Saturday, October 31".
// Uses the player's local time zone, since "today" follows their own clock.
export function formatHeaderDate(date: Date, locale = 'en-US'): string {
  return date.toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric' });
}
