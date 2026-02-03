export interface HighlightStats {
  power: number;
  speed: number;
  control: number;
}

export interface Highlight {
  id: string;
  title: string;
  category: 'Match' | 'Training' | 'Skills' | '1v1' | 'Pingball' | 'Lemon' | 'Warmup' | 'Recap' | 'Basketball' | 'Full Video' | 'Milestone';
  tags: string[];
  videoUrl: string;
  thumbnail: string;
  description?: string;
  stats?: HighlightStats;
  date?: string; // Date in YYYY-MM-DD format
  rating?: number; // Star rating from 1 to 5
  skillType?: string; // e.g., "Juggling", "Control", "Trick Shot", "First Touch"
  surface?: string; // e.g., "Concrete", "Turf", "Indoor", "Grass"
  progressTag?: 'Early' | 'Mid' | 'Recent'; // Development timeline
}

export interface PlayerStats {
  appearances: number;
  goals: number;
  assists: number;
  passAccuracy: string;
}

// Performance Data Types
export interface PerformanceData {
  age: number;
  year: number;
  goals: number;
  assists: number;
  successfulDribbles: number;
  minutesPlayed: number;
  matchRating: number;
  overallScore: number;
}

export interface HeatmapData {
  x: number;
  y: number;
  touches: number;
  passes: number;
  dribbles: number;
  zone: string;
}

export interface ShotData {
  x: number;
  y: number;
  foot: 'left' | 'right';
  outcome: 'goal' | 'on-target' | 'miss';
  xG: number;
}

export interface FootEfficiency {
  foot: 'left' | 'right';
  shotAccuracy: number;
  goalConversion: number;
  power: number;
  curve: number;
  firstTouchShots: number;
}