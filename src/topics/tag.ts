import type { Story } from '../news/types';
import type { Topic } from './types';

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Whole-word match, so "ai" doesn't match "said" and "fed" doesn't match "federal".
// Curly apostrophes are normalized so "governor’s race" matches "governor's race".
function mentions(text: string, keyword: string): boolean {
  const pattern = new RegExp(`(^|[^a-z0-9])${escapeRegExp(keyword)}($|[^a-z0-9])`);
  return pattern.test(text);
}

// A story belongs to a topic when any outlet's headline mentions one of the topic's keywords.
export function storyMatchesTopic(story: Story, topic: Topic): boolean {
  if (topic.sections && !topic.sections.includes(story.section)) return false;
  const text = [story.headline, ...story.outlets.map((o) => o.headline)]
    .join(' \n ')
    .toLowerCase()
    .replace(/[’‘]/g, "'");
  return topic.keywords.some((k) => mentions(text, k));
}

export function topicsForStory(story: Story, topics: Topic[]): Topic[] {
  return topics.filter((t) => storyMatchesTopic(story, t));
}

// "2022-02-24" -> "Feb 24, 2022", "2026-09" -> "September 2026", "1948" -> "1948".
export function formatKeyDate(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  if (!m) return String(y);
  if (!d) return new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
