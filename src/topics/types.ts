import type { Section } from '../news/types';

export interface SourceLink {
  title: string;
  url: string;
}

export interface KeyDate {
  // ISO date at the precision we're sure of: "2022", "2026-09", or "2022-02-24".
  date: string;
  text: string;
  source: string;
}

export interface Topic {
  id: string;
  name: string;
  updated: string; // YYYY-MM-DD, when the background was last checked
  background: string[]; // 3–4 short neutral sentences, one per paragraph
  sources: SourceLink[]; // 2+ for the background
  dates: KeyDate[]; // oldest first
  // Lowercase words or phrases matched as whole words against a story's headlines.
  keywords: string[];
  // Only tag stories from these sections (all sections when missing).
  sections?: Section[];
}

export interface TopicList {
  approved: string;
  topics: Topic[];
}
