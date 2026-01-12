export interface HighlightStats {
  power: number;
  speed: number;
  control: number;
}

export interface Highlight {
  id: string;
  title: string;
  category: 'Match' | 'Training' | 'Skills' | '1v1' | 'Pingball' | 'Lemon' | 'Warmup' | 'Recap' | 'Basketball';
  tags: string[];
  videoUrl: string;
  thumbnail: string;
  description?: string;
  stats?: HighlightStats;
}

export interface PlayerStats {
  appearances: number;
  goals: number;
  assists: number;
  passAccuracy: string;
}