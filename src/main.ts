import './style.css';
import { formatHeaderDate } from './date';

const dateEl = document.getElementById('today-date');
if (dateEl) {
  dateEl.textContent = formatHeaderDate(new Date());
}
