import { Habit, UserProfile, RankInfo, DailyQuest } from './types';

// XP needed for a given level (exponential curve)
export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

// Get current level from total XP
export function getLevelFromXP(totalXP: number): number {
  let level = 1;
  let xp = totalXP;
  while (xp >= xpForLevel(level)) {
    xp -= xpForLevel(level);
    level++;
  }
  return level;
}

// Get XP progress within current level
export function getXPProgress(totalXP: number): { current: number; needed: number; percentage: number } {
  let level = 1;
  let xp = totalXP;
  while (xp >= xpForLevel(level)) {
    xp -= xpForLevel(level);
    level++;
  }
  const needed = xpForLevel(level);
  return { current: xp, needed, percentage: Math.floor((xp / needed) * 100) };
}

export const RANKS: RankInfo[] = [
  { rank: 'Bronze', minXP: 0, maxXP: 499, color: '#CD7F32', gradient: 'from-orange-700 to-orange-500', icon: '🥉' },
  { rank: 'Silver', minXP: 500, maxXP: 1499, color: '#C0C0C0', gradient: 'from-gray-400 to-gray-200', icon: '🥈' },
  { rank: 'Gold', minXP: 1500, maxXP: 3999, color: '#FFD700', gradient: 'from-yellow-500 to-yellow-300', icon: '🥇' },
  { rank: 'Platinum', minXP: 4000, maxXP: 9999, color: '#E5E4E2', gradient: 'from-slate-300 to-slate-100', icon: '💎' },
  { rank: 'Diamond', minXP: 10000, maxXP: 24999, color: '#B9F2FF', gradient: 'from-cyan-400 to-blue-300', icon: '💠' },
  { rank: 'Master', minXP: 25000, maxXP: 74999, color: '#AA00FF', gradient: 'from-purple-600 to-purple-400', icon: '👑' },
  { rank: 'Legend', minXP: 75000, maxXP: Infinity, color: '#FF6B00', gradient: 'from-red-500 to-orange-400', icon: '⚡' },
];

export function getRankFromXP(totalXP: number): RankInfo {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (totalXP >= RANKS[i].minXP) return RANKS[i];
  }
  return RANKS[0];
}

export function getNextRank(totalXP: number): RankInfo | null {
  const currentRank = getRankFromXP(totalXP);
  const idx = RANKS.findIndex(r => r.rank === currentRank.rank);
  return idx < RANKS.length - 1 ? RANKS[idx + 1] : null;
}

export function getRankProgress(totalXP: number): { current: number; needed: number; percentage: number } {
  const rank = getRankFromXP(totalXP);
  const next = getNextRank(totalXP);
  if (!next) return { current: 0, needed: 0, percentage: 100 };
  const range = next.minXP - rank.minXP;
  const progress = totalXP - rank.minXP;
  return { current: progress, needed: range, percentage: Math.floor((progress / range) * 100) };
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function isCompletedToday(habit: Habit): boolean {
  return habit.completedDates.includes(getTodayString());
}

// --- Schedule helpers ---

export const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export function getTodayDayIndex(): number {
  return new Date().getDay();
}

/** Returns the schedule for a habit, defaulting to every day for backward compat. */
export function getHabitScheduleDays(habit: Habit): number[] {
  if (!habit.scheduleDays || habit.scheduleDays.length === 0) {
    return [0, 1, 2, 3, 4, 5, 6];
  }
  return habit.scheduleDays;
}

export function isHabitScheduledToday(habit: Habit): boolean {
  return getHabitScheduleDays(habit).includes(getTodayDayIndex());
}

export function getScheduledHabitsForToday(habits: Habit[]): Habit[] {
  return habits.filter(h => h.active && isHabitScheduledToday(h));
}

// --- Streak (schedule-aware) ---

export function calculateStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0;
  const sorted = [...completedDates].sort().reverse();
  const today = getTodayString();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

  let streak = 0;
  let checkDate = sorted[0] === today ? new Date() : new Date(Date.now() - 86400000);

  for (const date of sorted) {
    const check = checkDate.toISOString().split('T')[0];
    if (date === check) {
      streak++;
      checkDate = new Date(checkDate.getTime() - 86400000);
    } else {
      break;
    }
  }
  return streak;
}

/**
 * Schedule-aware streak: only counts scheduled days.
 * Skipped non-scheduled days don't break the streak.
 */
export function calculateScheduleAwareStreak(completedDates: string[], scheduleDays: number[]): number {
  if (completedDates.length === 0) return 0;
  const days = scheduleDays.length === 0 ? [0, 1, 2, 3, 4, 5, 6] : scheduleDays;

  const completedSet = new Set(completedDates);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayStr = today.toISOString().split('T')[0];
  const yesterdayDate = new Date(today.getTime() - 86400000);
  const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

  // Must have completed today or yesterday to have an active streak
  if (!completedSet.has(todayStr) && !completedSet.has(yesterdayStr)) return 0;

  const startDate = completedSet.has(todayStr) ? today : yesterdayDate;

  let streak = 0;
  let current = new Date(startDate.getTime());

  // Walk back up to 2 years of calendar days
  for (let i = 0; i < 730; i++) {
    const dayOfWeek = current.getDay();
    if (days.includes(dayOfWeek)) {
      const dateStr = current.toISOString().split('T')[0];
      if (completedSet.has(dateStr)) {
        streak++;
      } else {
        break;
      }
    }
    current = new Date(current.getTime() - 86400000);
  }

  return streak;
}

export const DIFFICULTY_XP: Record<string, number> = {
  Easy: 10,
  Normal: 25,
  Hard: 50,
  Epic: 100,
};

export const ACHIEVEMENTS_LIST = [
  { id: 'first_habit_completed', title: 'First Step', description: 'Complete your first habit', icon: '🌟' },
  { id: 'streak_7', title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥' },
  { id: 'streak_30', title: 'Month Master', description: 'Maintain a 30-day streak', icon: '⚡' },
  { id: 'level_10', title: 'Rising Hero', description: 'Reach Level 10', icon: '🏆' },
  { id: 'perfect_day', title: 'Perfect Day', description: 'Complete all habits in a single day', icon: '👑' },
  { id: 'xp_1000', title: 'XP Hunter', description: 'Earn 1000 total XP', icon: '💎' },
  { id: 'habits_5', title: 'Habit Builder', description: 'Create 5 habits', icon: '🏗️' },
  { id: 'hard_habit', title: 'Challenge Accepted', description: 'Complete a Hard or Epic habit', icon: '⚔️' },
];

export function checkAchievements(
  habits: Habit[],
  profile: UserProfile
): string[] {
  const newly: string[] = [];
  const level = getLevelFromXP(profile.totalXP);

  const completedToday = habits.filter(isCompletedToday);
  const scheduledToday = getScheduledHabitsForToday(habits);

  const checks: { id: string; condition: boolean }[] = [
    { id: 'first_habit_completed', condition: habits.some(h => h.completedDates.length > 0) },
    { id: 'streak_7', condition: habits.some(h => h.streak >= 7) },
    { id: 'streak_30', condition: habits.some(h => h.streak >= 30) },
    { id: 'level_10', condition: level >= 10 },
    { id: 'perfect_day', condition: scheduledToday.length > 0 && completedToday.length === scheduledToday.length },
    { id: 'xp_1000', condition: profile.totalXP >= 1000 },
    { id: 'habits_5', condition: habits.length >= 5 },
    { id: 'hard_habit', condition: habits.some(h => (h.difficulty === 'Hard' || h.difficulty === 'Epic') && h.completedDates.length > 0) },
  ];

  for (const check of checks) {
    if (check.condition && !profile.achievements.includes(check.id)) {
      newly.push(check.id);
    }
  }

  return newly;
}

export function getDailyQuests(habits: Habit[], profile: UserProfile): DailyQuest[] {
  const today = getTodayString();
  const completed = profile.lastDailyQuestDate === today ? profile.dailyQuestsCompleted : [];
  const scheduledToday = getScheduledHabitsForToday(habits);
  const completedToday = scheduledToday.filter(isCompletedToday);
  const hardCompletedToday = completedToday.filter(h => h.difficulty === 'Hard' || h.difficulty === 'Epic');

  return [
    {
      id: 'complete_3',
      title: 'Habit Trio',
      description: 'Complete 3 habits today',
      xpReward: 50,
      completed: completed.includes('complete_3') || completedToday.length >= 3,
    },
    {
      id: 'hard_habit',
      title: 'Hard Hitter',
      description: 'Complete 1 Hard or Epic habit',
      xpReward: 75,
      completed: completed.includes('hard_habit') || hardCompletedToday.length >= 1,
    },
    {
      id: 'all_habits',
      title: 'Perfectionist',
      description: 'Complete all active habits today',
      xpReward: 100,
      completed: completed.includes('all_habits') || (scheduledToday.length > 0 && completedToday.length >= scheduledToday.length),
    },
  ];
}

