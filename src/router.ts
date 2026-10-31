// Hash routes keep the site a single static page that works on GitHub Pages:
// #/ (Today), #/topics, #/topics/<id>, #/quiz.
export type Route = { view: 'today' } | { view: 'topics' } | { view: 'topic'; id: string } | { view: 'quiz' };

export function parseRoute(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (parts[0] === 'topics') return parts[1] ? { view: 'topic', id: decodeURIComponent(parts[1]) } : { view: 'topics' };
  if (parts[0] === 'quiz') return { view: 'quiz' };
  return { view: 'today' };
}

export function topicHref(id: string): string {
  return `#/topics/${encodeURIComponent(id)}`;
}
