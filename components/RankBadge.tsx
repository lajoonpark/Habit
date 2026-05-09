'use client';
import { getRankFromXP, getRankProgress, getNextRank } from '@/lib/gameLogic';

interface RankBadgeProps {
  totalXP: number;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function RankBadge({ totalXP, showProgress = false, size = 'md' }: RankBadgeProps) {
  const rank = getRankFromXP(totalXP);
  const next = getNextRank(totalXP);
  const progress = getRankProgress(totalXP);

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const iconSizes = { sm: 'text-lg', md: 'text-2xl', lg: 'text-4xl' };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`bg-gradient-to-r ${rank.gradient} ${sizeClasses[size]} rounded-full flex items-center gap-2 shadow-lg`}>
        <span className={iconSizes[size]}>{rank.icon}</span>
        <span className="font-bold text-gray-900">{rank.rank}</span>
      </div>
      {showProgress && next && (
        <div className="w-full">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{progress.current} XP</span>
            <span>→ {next.rank} ({progress.needed} XP)</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-full bg-gradient-to-r ${rank.gradient} rounded-full transition-all duration-700`}
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
      )}
      {showProgress && !next && (
        <span className="text-xs text-yellow-400 font-semibold">MAX RANK ACHIEVED!</span>
      )}
    </div>
  );
}
