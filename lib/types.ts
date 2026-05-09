export type Difficulty = 'Easy' | 'Normal' | 'Hard' | 'Epic';

export interface Habit {
  id: string;
  name: string;
  description: string;
  difficulty: Difficulty;
  xpReward: number;
  color: string;
  icon: string;
  active: boolean;
  createdAt: string;
  completedDates: string[]; // ISO date strings "YYYY-MM-DD"
  streak: number;
  longestStreak: number;
  scheduleDays: number[]; // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
}

export interface UserProfile {
  name: string;
  totalXP: number;
  streakFreezes: number;
  joinedAt: string;
  achievements: string[]; // achievement IDs
  lastDailyQuestDate: string;
  dailyQuestsCompleted: string[]; // quest IDs completed today
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
}

export type Rank = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master' | 'Legend';

export interface RankInfo {
  rank: Rank;
  minXP: number;
  maxXP: number;
  color: string;
  gradient: string;
  icon: string;
}
