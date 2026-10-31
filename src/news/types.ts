// Shapes shared by the daily headlines job (scripts/news) and the website.

export type Leaning = 'left' | 'center' | 'right';
export type Section = 'world' | 'us';

export interface Source {
  id: string;
  name: string;
  leaning: Leaning;
  adFontes: { bias: number; reliability: number; label: string };
  feeds: Record<Section, string>;
  attribution: string;
  paywall: boolean;
  domains: string[];
}

export interface SourceList {
  sources: Source[];
}

// One headline from one outlet's feed.
export interface FeedItem {
  sourceId: string;
  section: Section;
  headline: string;
  url: string;
  publishedAt: string; // ISO 8601
}

// How one outlet covered a story, as shown under "Show outlets".
export interface Coverage {
  sourceId: string;
  name: string;
  leaning: Leaning;
  headline: string;
  url: string;
  paywall: boolean;
  publishedAt: string;
}

// A story that passed the cross-check: 2+ outlets with 2+ different leanings.
export interface Story {
  id: string;
  section: Section;
  headline: string; // from the most central outlet that covered it
  leanings: Leaning[];
  outlets: Coverage[];
}

export interface SourceStatus {
  id: string;
  ok: boolean;
  items: number;
  error?: string;
}

// The file written each morning to public/data/headlines/<date>.json.
export interface DayFile {
  date: string; // YYYY-MM-DD in US Central time
  generatedAt: string; // ISO 8601
  sources: SourceStatus[];
  world: Story[];
  us: Story[];
}
