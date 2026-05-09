'use client';
import { useState, useCallback } from 'react';
import { useHabits, useProfile } from '@/lib/store';
import {
  getLevelFromXP,
  isCompletedToday,
  calculateScheduleAwareStreak,
  getHabitScheduleDays,
  getScheduledHabitsForToday,
  getTodayString,
  checkAchievements,
  getDailyQuests,
  ACHIEVEMENTS_LIST,
  getRankFromXP,
} from '@/lib/gameLogic';
import XPBar from '@/components/XPBar';
import RankBadge from '@/components/RankBadge';
import HabitCard from '@/components/HabitCard';
import DailyQuestCard from '@/components/DailyQuestCard';
import LevelUpModal from '@/components/LevelUpModal';
import Toast from '@/components/Toast';

export default function Dashboard() {
  const [habits, setHabits] = useHabits();
  const [profile, setProfile] = useProfile();
  const [levelUpLevel, setLevelUpLevel] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const scheduledToday = getScheduledHabitsForToday(habits);
  const completedToday = scheduledToday.filter(isCompletedToday);
  const quests = getDailyQuests(habits, profile);
  const today = getTodayString();

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ message, type });
  };

  const handleComplete = useCallback((habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit || isCompletedToday(habit)) return;

    const prevLevel = getLevelFromXP(profile.totalXP);

    const newCompletedDates = [...habit.completedDates, today];
    const newStreak = calculateScheduleAwareStreak(newCompletedDates, getHabitScheduleDays(habit));
    const newLongestStreak = Math.max(habit.longestStreak, newStreak);

    const updatedHabits = habits.map(h =>
      h.id === habitId
        ? { ...h, completedDates: newCompletedDates, streak: newStreak, longestStreak: newLongestStreak }
        : h
    );

    // Check daily quests
    const scheduledHabitsAfterUpdate = getScheduledHabitsForToday(updatedHabits);
    const completedNow = scheduledHabitsAfterUpdate.filter(h => isCompletedToday(h));
    
    let questXP = 0;
    const newQuestsCompleted = [...(profile.lastDailyQuestDate === today ? profile.dailyQuestsCompleted : [])];
    
    // Re-check quests after completing this habit
    const newQuestStates = [
      { id: 'complete_3', cond: completedNow.length >= 3 },
      { id: 'hard_habit', cond: completedNow.some(h => h.difficulty === 'Hard' || h.difficulty === 'Epic') },
      { id: 'all_habits', cond: scheduledHabitsAfterUpdate.length > 0 && completedNow.length >= scheduledHabitsAfterUpdate.length },
    ];
    for (const q of newQuestStates) {
      if (q.cond && !newQuestsCompleted.includes(q.id)) {
        newQuestsCompleted.push(q.id);
        const questInfo = quests.find(dq => dq.id === q.id);
        if (questInfo) questXP += questInfo.xpReward;
      }
    }

    const totalXPGain = habit.xpReward + questXP;
    const finalXP = profile.totalXP + totalXPGain;
    const finalLevel = getLevelFromXP(finalXP);

    const updatedProfile = {
      ...profile,
      totalXP: finalXP,
      lastDailyQuestDate: today,
      dailyQuestsCompleted: newQuestsCompleted,
    };

    // Check achievements
    const newAchievements = checkAchievements(updatedHabits, updatedProfile);
    if (newAchievements.length > 0) {
      updatedProfile.achievements = [...profile.achievements, ...newAchievements];
      const achieved = ACHIEVEMENTS_LIST.find(a => a.id === newAchievements[0]);
      if (achieved) showToast(`🏆 Achievement: ${achieved.title}!`, 'info');
    }

    setHabits(updatedHabits);
    setProfile(updatedProfile);

    if (finalLevel > prevLevel) {
      setLevelUpLevel(finalLevel);
    } else if (questXP > 0) {
      showToast(`+${totalXPGain} XP! Quest completed! 🎯`, 'success');
    } else {
      showToast(`+${habit.xpReward} XP earned! Keep going! ⚡`, 'success');
    }
  }, [habits, profile, quests, today, setHabits, setProfile]);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const rank = getRankFromXP(profile.totalXP);
  const completionPct = scheduledToday.length > 0 ? Math.round((completedToday.length / scheduledToday.length) * 100) : 0;

  return (
    <div className="space-y-8">
      {levelUpLevel && (
        <LevelUpModal level={levelUpLevel} onClose={() => setLevelUpLevel(null)} />
      )}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-750 rounded-2xl p-6 border border-gray-700 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-gray-400 text-sm">{dateStr}</p>
            <h1 className="text-2xl font-bold text-white mt-1">
              {greeting()}, <span className="text-purple-400">{profile.name}</span>! 👋
            </h1>
          </div>
          <RankBadge totalXP={profile.totalXP} size="md" />
        </div>
        <div className="mt-4">
          <XPBar totalXP={profile.totalXP} />
        </div>
        <div className="mt-3 flex items-center gap-4 text-sm">
          <span className="text-gray-400">Total XP: <span className="text-yellow-400 font-bold">{profile.totalXP.toLocaleString()}</span></span>
          <span className="text-gray-400">Rank: <span style={{ color: rank.color }} className="font-bold">{rank.rank}</span></span>
        </div>
      </div>

      {/* Progress for today */}
      {scheduledToday.length > 0 && (
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-white font-semibold">Today&apos;s Progress</h2>
            <span className="text-sm text-gray-400">{completedToday.length}/{scheduledToday.length} done</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          {completionPct === 100 && (
            <p className="text-green-400 text-sm mt-2 font-medium">🎉 All habits completed today! Amazing!</p>
          )}
        </div>
      )}

      {/* Daily Quests */}
      <div>
        <h2 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
          <span>🎯</span> Daily Quests
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {quests.map(quest => (
            <DailyQuestCard key={quest.id} quest={quest} />
          ))}
        </div>
      </div>

      {/* Today's Habits */}
      <div>
        <h2 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
          <span>✅</span> Today&apos;s Habits
          {completedToday.length > 0 && (
            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">
              {completedToday.length} done
            </span>
          )}
        </h2>
        {scheduledToday.length === 0 ? (
          <div className="bg-gray-800 rounded-2xl p-8 text-center border border-gray-700">
            <p className="text-4xl mb-3">🌴</p>
            <p className="text-gray-400">No habits scheduled for today. Enjoy the break!</p>
            <a href="/habits" className="mt-3 inline-block text-purple-400 hover:text-purple-300 text-sm font-medium">
              Manage habits →
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {scheduledToday.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onComplete={handleComplete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
