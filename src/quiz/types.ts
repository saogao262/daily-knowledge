export interface QuizEvent {
  id: string;
  date: string; // YYYY-MM-DD, inside the quiz week
  title: string;
  why: string; // 1–2 friendly sentences shown after placing the card
  source: string;
}

export interface Question {
  id: string;
  prompt: string;
  options: string[]; // exactly 4
  answer: number; // index into options
  explanation: string; // 1–2 sentences
  source: string;
}

export interface Quiz {
  id: string; // the Saturday it's published, YYYY-MM-DD
  weekStart: string; // Saturday before, YYYY-MM-DD
  weekEnd: string; // Friday, YYYY-MM-DD
  anchor: QuizEvent; // shown on the timeline from the start
  cards: QuizEvent[]; // placed by the player, in the order they're shown
  questions: Question[];
}

export interface QuizList {
  quizzes: Quiz[];
}

// What's saved in the browser after finishing a quiz.
export interface QuizResult {
  quizId: string;
  right: boolean[]; // one per card, then one per question
  missed: string[]; // ids of cards and questions answered wrong
  finishedAt: string; // ISO 8601
}
