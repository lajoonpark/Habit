import { useLocalStorage } from './useLocalStorage';
import { Habit, UserProfile } from './types';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Hero',
  totalXP: 0,
  streakFreezes: 3,
  joinedAt: new Date().toISOString(),
  achievements: [],
  lastDailyQuestDate: '',
  dailyQuestsCompleted: [],
};

const SAMPLE_HABITS: Habit[] = [
  {
    id: '1',
    name: 'Morning Workout',
    description: 'Exercise for at least 30 minutes',
    difficulty: 'Hard',
    xpReward: 50,
    color: '#FF6B6B',
    icon: '💪',
    active: true,
    createdAt: new Date().toISOString(),
    completedDates: [],
    streak: 0,
    longestStreak: 0,
  },
  {
    id: '2',
    name: 'Read 20 Pages',
    description: 'Read a book for personal growth',
    difficulty: 'Normal',
    xpReward: 25,
    color: '#4ECDC4',
    icon: '📚',
    active: true,
    createdAt: new Date().toISOString(),
    completedDates: [],
    streak: 0,
    longestStreak: 0,
  },
  {
    id: '3',
    name: 'Meditate',
    description: '10 minutes of mindfulness',
    difficulty: 'Easy',
    xpReward: 10,
    color: '#A8E6CF',
    icon: '🧘',
    active: true,
    createdAt: new Date().toISOString(),
    completedDates: [],
    streak: 0,
    longestStreak: 0,
  },
];

export function useHabits() {
  return useLocalStorage<Habit[]>('habits', SAMPLE_HABITS);
}

export function useProfile() {
  return useLocalStorage<UserProfile>('userProfile', DEFAULT_PROFILE);
}
