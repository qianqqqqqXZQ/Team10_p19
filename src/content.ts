import data from './bid-content.json';

export interface Phase {
  id: number;
  title: string;
  date: string;
  start: string;
  end: string;
  kind: 'active' | 'review' | 'light';
  tasks: string[];
}

export interface Member {
  name: string;
  initials: string;
  role: string;
  focus: string;
  tags: string[];
  background: string;
  evidence: string[];
  bio: string;
  html: string;
  responsibility: string;
}

export interface BidContent {
  title: string;
  date: string;
  team: string;
  source: { file: string; modified: string; sha256: string };
  members: Member[];
  phases: Phase[];
  sections: { id: string; title: string; html: string }[];
}

// Generated, local content is validated by scripts/extract_bid.py.
export const bid = data as BidContent;
