'use client';
import { useHabits, useProfile } from '@/lib/store';
import { getLevelFromXP, getXPProgress, RANKS, getRankFromXP, getRankProgress, getNextRank, ACHIEVEMENTS_LIST } from '@/lib/gameLogic';
import RankBadge from '@/components/RankBadge';
import XPBar from '@/components/XPBar';
import AchievementCard from '@/components/AchievementCard';

export default function ProgressPage() {
  const [habits] = useHabits();
  const [profile] = useProfile();

  const level = getLevelFromXP(profile.totalXP);
  const xpProgress = getXPProgress(profile.totalXP);
  const currentRank = getRankFromXP(profile.totalXP);
  const rankProgress = getRankProgress(profile.totalXP);
  const nextRank = getNextRank(profile.totalXP);

  const totalCompleted = habits.reduce((sum, h) => sum + h.completedDates.length, 0);
  const longestStreak = habits.reduce((max, h) => Math.max(max, h.longestStreak), 0);

  const achievementsWithStatus = ACHIEVEMENTS_LIST.map(a => ({
    ...a,
    unlocked: profile.achievements.includes(a.id),
  }));

  const unlockedCount = achievementsWithStatus.filter(a => a.unlocked).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Progress</h1>
        <p className="text-gray-400 text-sm mt-1">Track your growth and achievements</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total XP', value: profile.totalXP.toLocaleString(), icon: '⚡', color: 'text-yellow-400' },
          { label: 'Level', value: level.toString(), icon: '🎮', color: 'text-purple-400' },
          { label: 'Habits Done', value: totalCompleted.toString(), icon: '✅', color: 'text-green-400' },
          { label: 'Best Streak', value: `${longestStreak}d`, icon: '🔥', color: 'text-orange-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-gray-800 rounded-2xl p-4 border border-gray-700 text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-gray-500 text-xs mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Level Progress */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <h2 className="text-white font-bold text-lg mb-4">Level Progress</h2>
        <XPBar totalXP={profile.totalXP} />
        <p className="text-gray-400 text-sm mt-2">
          {xpProgress.needed - xpProgress.current} XP needed for Level {level + 1}
        </p>
      </div>

      {/* Current Rank */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <h2 className="text-white font-bold text-lg mb-4">Current Rank</h2>
        <div className="flex flex-col items-center gap-4">
          <RankBadge totalXP={profile.totalXP} size="lg" showProgress />
          {nextRank && (
            <p className="text-gray-400 text-sm text-center">
              {nextRank.minXP - profile.totalXP} XP until {nextRank.icon} {nextRank.rank}
            </p>
          )}
        </div>
      </div>

      {/* All Ranks */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <h2 className="text-white font-bold text-lg mb-4">All Ranks</h2>
        <div className="space-y-3">
          {RANKS.map(rank => {
            const isCurrent = rank.rank === currentRank.rank;
            const isUnlocked = profile.totalXP >= rank.minXP;
            return (
              <div
                key={rank.rank}
                className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${
                  isCurrent
                    ? 'border-purple-500/50 bg-purple-500/10'
                    : isUnlocked
                    ? 'border-gray-600 bg-gray-700/50'
                    : 'border-gray-700/50 opacity-40'
                }`}
              >
                <span className="text-2xl">{rank.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold text-sm ${isCurrent ? 'text-white' : isUnlocked ? 'text-gray-300' : 'text-gray-600'}`}>
                      {rank.rank}
                    </span>
                    {isCurrent && (
                      <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/30">
                        Current
                      </span>
                    )}
                    {isUnlocked && !isCurrent && (
                      <span className="text-xs text-green-400">✓ Unlocked</span>
                    )}
                  </div>
                  <span className="text-gray-500 text-xs">
                    {rank.minXP.toLocaleString()} – {rank.maxXP === Infinity ? '∞' : rank.maxXP.toLocaleString()} XP
                  </span>
                </div>
                {isCurrent && (
                  <div className="w-24">
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div
                        className={`h-full bg-gradient-to-r ${rank.gradient} rounded-full`}
                        style={{ width: `${rankProgress.percentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
          🏆 Achievements
          <span className="text-sm text-gray-400 font-normal">({unlockedCount}/{ACHIEVEMENTS_LIST.length})</span>
        </h2>
        <p className="text-gray-500 text-sm mb-4">Complete goals to unlock achievements</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {achievementsWithStatus.map(achievement => (
            <AchievementCard
              key={achievement.id}
              id={achievement.id}
              title={achievement.title}
              description={achievement.description}
              icon={achievement.icon}
              unlocked={achievement.unlocked}
            />
          ))}
        </div>
      </div>

      {/* Habit Stats */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <h2 className="text-white font-bold text-lg mb-4">Habit Stats</h2>
        <div className="space-y-3">
          {habits.map(habit => (
            <div key={habit.id} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-xl">
              <span className="text-xl">{habit.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{habit.name}</p>
                <p className="text-gray-400 text-xs">{habit.completedDates.length} completions</p>
              </div>
              <div className="text-right flex-shrink-0">
                {habit.streak > 0 && (
                  <p className="text-orange-400 text-xs">🔥 {habit.streak}d streak</p>
                )}
                <p className="text-gray-500 text-xs">Best: {habit.longestStreak}d</p>
              </div>
            </div>
          ))}
          {habits.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">No habits yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
