export type GameType = 'picture-matching' | 'sequence-memory' | 'object-recognition';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type UserFeedback = 'Too Easy' | 'Comfortable' | 'Too Difficult' | 'I Want a Break';

export interface GameSession {
  id: string;
  timestamp: string; // ISO date string
  gameType: GameType;
  gameName: string;
  difficulty: DifficultyLevel;
  durationSeconds: number;
  attempts: number;
  hintsUsed: number;
  score: number;
  maxScore: number;
  accuracy: number; // percentage 0 - 100
  feedback: UserFeedback;
  notes?: string;
}

export type MemoryCategory = 'family' | 'places' | 'pets' | 'milestones';

export interface MemoryCard {
  id: string;
  name: string;
  category: MemoryCategory;
  relationship: string;
  imageUrl: string;
  notes: string;
  dateAdded: string;
  lastReviewed?: string;
  favorite?: boolean;
}

export type ReminderCategory = 'medication' | 'hydration' | 'activity' | 'social' | 'nutrition';

export interface Reminder {
  id: string;
  title: string;
  time: string; // e.g. "09:00 AM"
  category: ReminderCategory;
  completed: boolean;
  completedAt?: string;
  frequency: 'daily' | 'weekly' | 'custom';
  notes?: string;
}

export interface FeatureFactor {
  factor: string;
  weight: number; // 0 - 100
  direction: 'up' | 'down' | 'steady';
  description: string;
  metricValue: string;
}

export interface AIRecommendation {
  recommendedGame: GameType;
  recommendedGameName: string;
  recommendedDifficulty: DifficultyLevel;
  confidenceScore: number; // 0 - 100
  rationale: string;
  clinicalRationale: string;
  factors: FeatureFactor[];
  recommendedBreak: boolean;
  hydrationPrompt?: boolean;
  generatedAt: string;
}

export interface CaregiverOverview {
  totalSessions: number;
  averageDurationSeconds: number;
  reminderCompletionRate: number;
  cognitiveStabilityIndex: number;
  favoriteGame: string;
  comfortDistribution: Record<UserFeedback, number>;
}

export type TextSize = 'normal' | 'large' | 'extra-large';

export interface UserPreferences {
  textSize: TextSize;
  highContrast: boolean;
  speechEnabled: boolean;
  soundVolume: number; // 0 to 1
}
