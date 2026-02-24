import { PerformanceData, HeatmapData, ShotData, FootEfficiency } from '../types';

// Sample performance data across career
export const performanceData: PerformanceData[] = [
  { age: 16, year: 2018, goals: 8, assists: 4, successfulDribbles: 45, minutesPlayed: 1200, matchRating: 6.8, overallScore: 65 },
  { age: 17, year: 2019, goals: 12, assists: 7, successfulDribbles: 62, minutesPlayed: 1800, matchRating: 7.2, overallScore: 72 },
  { age: 18, year: 2020, goals: 18, assists: 11, successfulDribbles: 78, minutesPlayed: 2400, matchRating: 7.6, overallScore: 81 },
  { age: 19, year: 2021, goals: 24, assists: 15, successfulDribbles: 95, minutesPlayed: 2700, matchRating: 8.1, overallScore: 89 },
  { age: 20, year: 2022, goals: 28, assists: 18, successfulDribbles: 102, minutesPlayed: 2880, matchRating: 8.4, overallScore: 94 },
  { age: 21, year: 2023, goals: 32, assists: 22, successfulDribbles: 118, minutesPlayed: 3060, matchRating: 8.7, overallScore: 98 },
  { age: 22, year: 2024, goals: 35, assists: 25, successfulDribbles: 125, minutesPlayed: 3150, matchRating: 8.9, overallScore: 100 },
  { age: 23, year: 2025, goals: 31, assists: 21, successfulDribbles: 115, minutesPlayed: 2970, matchRating: 8.5, overallScore: 95 },
  { age: 24, year: 2026, goals: 11, assists: 12, successfulDribbles: 108, minutesPlayed: 2850, matchRating: 8.2, overallScore: 91 }
];

// Sample heatmap data showing field positioning - Striker/Central Attacking Focus
export const heatmapData: HeatmapData[] = [
  // Central Striker Zone - Highest Activity
  { x: 50, y: 90, touches: 198, passes: 85, dribbles: 42, zone: 'Central Final Third' },
  { x: 50, y: 95, touches: 156, passes: 45, dribbles: 38, zone: 'Penalty Area' },
  { x: 45, y: 92, touches: 142, passes: 52, dribbles: 35, zone: 'Left Penalty Area' },
  { x: 55, y: 92, touches: 138, passes: 48, dribbles: 33, zone: 'Right Penalty Area' },
  
  // Central Attacking Midfield - Very High Activity
  { x: 50, y: 80, touches: 187, passes: 125, dribbles: 38, zone: 'Central Attacking Mid' },
  { x: 50, y: 85, touches: 165, passes: 98, dribbles: 35, zone: 'Central Attack Deep' },
  
  // Wide Attacking Areas - Moderate Activity
  { x: 35, y: 85, touches: 98, passes: 58, dribbles: 22, zone: 'Left Final Third' },
  { x: 65, y: 85, touches: 94, passes: 54, dribbles: 20, zone: 'Right Final Third' },
  { x: 25, y: 80, touches: 76, passes: 45, dribbles: 15, zone: 'Left Wing Attack' },
  { x: 75, y: 80, touches: 72, passes: 42, dribbles: 14, zone: 'Right Wing Attack' },
  
  // Midfield Transition - Lower Activity
  { x: 50, y: 65, touches: 112, passes: 89, dribbles: 12, zone: 'Central Midfield' },
  { x: 40, y: 70, touches: 68, passes: 52, dribbles: 8, zone: 'Left Central Mid' },
  { x: 60, y: 70, touches: 65, passes: 48, dribbles: 7, zone: 'Right Central Mid' },
  
  // Wide Midfield - Minimal Activity
  { x: 20, y: 75, touches: 45, passes: 32, dribbles: 5, zone: 'Left Wing Mid' },
  { x: 80, y: 75, touches: 42, passes: 28, dribbles: 4, zone: 'Right Wing Mid' },
  
  // Defensive Areas - Very Low Activity (Rare Drop Back)
  { x: 50, y: 50, touches: 38, passes: 28, dribbles: 2, zone: 'Defensive Mid' },
  { x: 35, y: 40, touches: 22, passes: 18, dribbles: 1, zone: 'Left Defense' },
  { x: 65, y: 40, touches: 20, passes: 16, dribbles: 1, zone: 'Right Defense' }
];

// Sample shot data with foot preference and outcomes
export const shotData: ShotData[] = [
  { x: 45, y: 92, foot: 'right', outcome: 'goal', xG: 0.8 },
  { x: 55, y: 88, foot: 'left', outcome: 'goal', xG: 0.6 },
  { x: 50, y: 95, foot: 'right', outcome: 'goal', xG: 0.9 },
  { x: 40, y: 85, foot: 'right', outcome: 'on-target', xG: 0.4 },
  { x: 60, y: 90, foot: 'left', outcome: 'goal', xG: 0.7 },
  { x: 35, y: 80, foot: 'right', outcome: 'miss', xG: 0.3 },
  { x: 65, y: 87, foot: 'right', outcome: 'on-target', xG: 0.5 },
  { x: 48, y: 93, foot: 'left', outcome: 'on-target', xG: 0.6 },
  { x: 52, y: 89, foot: 'right', outcome: 'goal', xG: 0.8 },
  { x: 42, y: 78, foot: 'left', outcome: 'miss', xG: 0.2 },
  { x: 58, y: 82, foot: 'right', outcome: 'miss', xG: 0.3 },
  { x: 47, y: 96, foot: 'right', outcome: 'goal', xG: 0.9 },
  { x: 53, y: 91, foot: 'left', outcome: 'on-target', xG: 0.5 },
  { x: 38, y: 75, foot: 'right', outcome: 'miss', xG: 0.1 },
  { x: 62, y: 85, foot: 'left', outcome: 'goal', xG: 0.6 },
  { x: 49, y: 88, foot: 'right', outcome: 'on-target', xG: 0.4 },
  { x: 51, y: 94, foot: 'left', outcome: 'goal', xG: 0.8 },
  { x: 44, y: 83, foot: 'right', outcome: 'miss', xG: 0.2 },
  { x: 56, y: 86, foot: 'right', outcome: 'on-target', xG: 0.5 },
  { x: 46, y: 91, foot: 'left', outcome: 'goal', xG: 0.7 }
];

// Sample foot efficiency comparison data
export const footEfficiencyData: FootEfficiency[] = [
  {
    foot: 'right',
    shotAccuracy: 78,
    goalConversion: 42,
    power: 85,
    curve: 72,
    firstTouchShots: 68
  },
  {
    foot: 'left',
    shotAccuracy: 71,
    goalConversion: 38,
    power: 79,
    curve: 84,
    firstTouchShots: 61
  }
];