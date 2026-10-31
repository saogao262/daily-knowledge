import './style.css';
import content from './content/topics.json';
import { formatHeaderDate } from './date';
import { centralToday, longDate, pickDate, readDayFile, recentDates } from './news/day';
import { el, renderStatus, renderStories } from './news/render';
import type { DayFile, Story } from './news/types';
import quizContent from './content/quizzes.json';
import { currentQuiz } from './quiz/logic';
import { mountQuiz } from './quiz/screens';
import type { QuizList } from './quiz/types';
import { parseRoute } from './router';
import { renderTopicList, renderTopicPage } from './topics/render';
import type { TopicList } from './topics/types';

const { topics } = content as TopicList;
const DATA_URL = `${import.meta.env.BASE_URL}data/headlines/`;
const NO_STORIES = 'No story passed the cross-check today. Check back tomorrow.';
const LOAD_FAILED = "Headlines couldn't load. Check your connection and refresh.";

const views = {
  today: document.getElementById('view-today')!,
  topics: document.getElementById('view-topics')!,
  topic: document.getElementById('view-topic')!,
  quiz: document.getElementById('view-quiz')!,
};
const noticeEl = document.getElementById('notice')!;
const worldEl = document.getElementById('world')!;
const usEl = document.getElementById('us')!;
const topicListEl = document.getElementById('topic-list')!;

document.getElementById('today-date')!.textContent = formatHeaderDate(new Date());

// Stories from the past week, newest day first, for topic pages. null until loaded.
let recentStories: Story[] | null = null;

async function getJson(path: string): Promise<unknown> {
  const response = await fetch(DATA_URL + path, { cache: 'no-cache' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function getDay(date: string): Promise<DayFile | null> {
  try {
    return readDayFile(await getJson(`${date}.json`));
  } catch {
    return null;
  }
}

function showToday(day: DayFile, today: string): void {
  if (day.date !== today) {
    noticeEl.textContent = `Today's headlines aren't ready yet, so these are from ${longDate(day.date)}.`;
    noticeEl.hidden = false;
  }
  renderStories(worldEl, day.world, NO_STORIES, topics);
  renderStories(usEl, day.us, NO_STORIES, topics);
}

async function loadHeadlines(): Promise<void> {
  const today = centralToday(new Date());
  try {
    const index = (await getJson('index.json')) as { dates?: unknown };
    const dates = Array.isArray(index.dates) ? index.dates.filter((d): d is string => typeof d === 'string') : [];
    const date = pickDate(dates, today);
    if (!date) {
      const waiting = "Today's headlines aren't ready yet. They update every morning.";
      renderStatus(worldEl, waiting);
      renderStatus(usEl, waiting);
      recentStories = [];
      return;
    }

    const day = await getDay(date);
    if (!day) throw new Error('Unreadable day file');
    showToday(day, today);

    const others = await Promise.all(recentDates(dates, today).filter((d) => d !== date).map(getDay));
    const seen = new Set<string>();
    recentStories = [day, ...others.filter((d): d is DayFile => d !== null)]
      .flatMap((d) => [...d.world, ...d.us])
      .filter((s) => (seen.has(s.id) ? false : (seen.add(s.id), true)));
  } catch {
    renderStatus(worldEl, LOAD_FAILED);
    renderStatus(usEl, LOAD_FAILED);
    recentStories = [];
  }
  render();
}

function render(): void {
  const route = parseRoute(location.hash);
  for (const [name, view] of Object.entries(views)) view.hidden = name !== route.view;

  const tab = route.view === 'topic' ? 'topics' : route.view;
  for (const link of document.querySelectorAll<HTMLAnchorElement>('.tab')) {
    if (link.dataset.tab === tab) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
  document.body.classList.toggle('playful', route.view === 'quiz');

  let title = 'Daily Knowledge';
  if (route.view === 'topics') {
    renderTopicList(topicListEl, topics, recentStories);
    title = 'Topics · Daily Knowledge';
  } else if (route.view === 'topic') {
    const topic = topics.find((t) => t.id === route.id);
    if (topic) {
      renderTopicPage(views.topic, topic, recentStories);
      title = `${topic.name} · Daily Knowledge`;
    } else {
      const back = el('a', 'back-link', '‹ Topics');
      back.href = '#/topics';
      views.topic.replaceChildren(back, el('h1', undefined, 'Topic not found'));
    }
  } else if (route.view === 'quiz') {
    title = 'Weekly quiz · Daily Knowledge';
  }
  document.title = title;
}

let lastHash = location.hash;
window.addEventListener('hashchange', () => {
  render();
  // Opening a new screen starts at the top; the outlet toggles don't change the hash, so they keep their place.
  if (location.hash !== lastHash) window.scrollTo(0, 0);
  lastHash = location.hash;
});

const { quizzes } = quizContent as QuizList;
mountQuiz(views.quiz, quizzes, currentQuiz(quizzes, centralToday(new Date())), new URL(import.meta.env.BASE_URL, location.origin).href);

render();
loadHeadlines();
