import { el, renderStories } from '../news/render';
import type { Story } from '../news/types';
import { longDate } from '../news/day';
import { topicHref } from '../router';
import { formatKeyDate, storyMatchesTopic } from './tag';
import type { Topic } from './types';

function shortDate(date: string): string {
  return longDate(date).replace(/^\w+, /, '');
}

export function storiesForTopic(topic: Topic, stories: Story[]): Story[] {
  return stories.filter((s) => storyMatchesTopic(s, topic));
}

export function renderTopicList(container: HTMLElement, topics: Topic[], recent: Story[] | null): void {
  container.replaceChildren(
    ...topics.map((topic) => {
      const item = el('li');
      const link = el('a', 'topic-card');
      link.href = topicHref(topic.id);

      const text = el('span', 'topic-card-text');
      const count = recent ? storiesForTopic(topic, recent).length : null;
      const countText = count === null ? '' : ` · ${count} ${count === 1 ? 'story' : 'stories'} this week`;
      text.append(el('span', 'topic-card-name', topic.name), el('span', 'topic-card-meta', `Updated ${shortDate(topic.updated)}${countText}`));

      const arrow = el('span', 'topic-card-arrow', '›');
      arrow.setAttribute('aria-hidden', 'true');
      link.append(text, arrow);
      item.append(link);
      return item;
    }),
  );
}

export function renderTopicPage(root: HTMLElement, topic: Topic, recent: Story[] | null): void {
  const back = el('a', 'back-link', '‹ Topics');
  back.href = '#/topics';

  const title = el('h1', undefined, topic.name);
  const updated = el('p', 'eyebrow', `Background updated ${longDate(topic.updated)}`);

  const background = el('section', 'topic-section');
  background.append(el('h2', undefined, 'How we got here'), ...topic.background.map((p) => el('p', 'topic-paragraph', p)));

  const sources = el('details', 'topic-sources');
  sources.append(el('summary', undefined, `Sources (${topic.sources.length})`));
  const sourceList = el('ul');
  for (const s of topic.sources) {
    const a = el('a', undefined, s.title);
    a.href = s.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    const li = el('li');
    li.append(a);
    sourceList.append(li);
  }
  sources.append(sourceList);
  background.append(sources);

  const timeline = el('section', 'topic-section');
  const dates = el('ol', 'timeline');
  for (const d of topic.dates) {
    const li = el('li', 'timeline-item');
    const when = el('a', 'timeline-date', formatKeyDate(d.date));
    when.href = d.source;
    when.target = '_blank';
    when.rel = 'noopener noreferrer';
    when.title = 'Source';
    li.append(when, el('p', 'timeline-text', d.text));
    dates.append(li);
  }
  timeline.append(el('h2', undefined, 'Key dates'), dates);

  const week = el('section', 'topic-section');
  const weekStories = el('div', 'stories');
  week.append(el('h2', undefined, 'This week'), weekStories);
  if (recent === null) {
    weekStories.append(el('p', 'status', 'Loading this week’s headlines…'));
  } else {
    renderStories(weekStories, storiesForTopic(topic, recent), 'No cross-checked headlines on this topic in the past week.', [], topic.id);
  }

  root.replaceChildren(back, updated, title, background, timeline, week);
}
