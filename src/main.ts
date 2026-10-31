import './style.css';
import { formatHeaderDate } from './date';
import { centralToday, longDate, pickDate, readDayFile } from './news/day';
import { renderStatus, renderStories } from './news/render';

const DATA_URL = `${import.meta.env.BASE_URL}data/headlines/`;
const NO_STORIES = 'No story passed the cross-check today. Check back tomorrow.';
const LOAD_FAILED = "Headlines couldn't load. Check your connection and refresh.";

const dateEl = document.getElementById('today-date')!;
const noticeEl = document.getElementById('notice')!;
const worldEl = document.getElementById('world')!;
const usEl = document.getElementById('us')!;

dateEl.textContent = formatHeaderDate(new Date());

function showNotice(message: string): void {
  noticeEl.textContent = message;
  noticeEl.hidden = false;
}

async function getJson(path: string): Promise<unknown> {
  const response = await fetch(DATA_URL + path, { cache: 'no-cache' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function loadHeadlines(): Promise<void> {
  try {
    const index = (await getJson('index.json')) as { dates?: unknown };
    const dates = Array.isArray(index.dates) ? index.dates.filter((d): d is string => typeof d === 'string') : [];
    const today = centralToday(new Date());
    const date = pickDate(dates, today);
    if (!date) {
      renderStatus(worldEl, "Today's headlines aren't ready yet. They update every morning.");
      renderStatus(usEl, "Today's headlines aren't ready yet. They update every morning.");
      return;
    }

    const day = readDayFile(await getJson(`${date}.json`));
    if (!day) throw new Error('Unreadable day file');

    if (date !== today) {
      showNotice(`Today's headlines aren't ready yet, so these are from ${longDate(date)}.`);
    }
    renderStories(worldEl, day.world, NO_STORIES);
    renderStories(usEl, day.us, NO_STORIES);
  } catch {
    renderStatus(worldEl, LOAD_FAILED);
    renderStatus(usEl, LOAD_FAILED);
  }
}

loadHeadlines();
