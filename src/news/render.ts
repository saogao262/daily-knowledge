import { leaningName, outletsLabel } from './day';
import type { Coverage, Story } from './types';

// Every piece of feed text goes in through textContent, never innerHTML.
function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderOutlet(outlet: Coverage): HTMLLIElement {
  const item = el('li', 'outlet');

  const meta = el('div', 'outlet-meta');
  meta.append(el('span', 'outlet-name', outlet.name), el('span', `chip chip-${outlet.leaning}`, leaningName(outlet.leaning)));
  if (outlet.paywall) meta.append(el('span', 'chip chip-paywall', 'Paywall'));

  const link = el('a', 'outlet-headline', outlet.headline);
  link.href = outlet.url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';

  item.append(meta, link);
  return item;
}

function renderStory(story: Story): HTMLElement {
  const article = el('article', 'story');
  article.append(el('h3', 'story-headline', story.headline));

  const listId = `outlets-${story.section}-${story.id}`;
  const toggle = el('button', 'outlets-toggle', outletsLabel(story, false));
  toggle.type = 'button';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', listId);

  const list = el('ul', 'outlets');
  list.id = listId;
  list.hidden = true;
  list.append(...story.outlets.map(renderOutlet));

  toggle.addEventListener('click', () => {
    const open = list.hidden !== false;
    list.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = outletsLabel(story, open);
  });

  article.append(toggle, list);
  return article;
}

export function renderStories(container: HTMLElement, stories: Story[], emptyMessage: string): void {
  container.replaceChildren(...(stories.length ? stories.map(renderStory) : [el('p', 'status', emptyMessage)]));
}

export function renderStatus(container: HTMLElement, message: string): void {
  container.replaceChildren(el('p', 'status', message));
}
