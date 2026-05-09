'use client';
import { getXPProgress, getLevelFromXP } from '@/lib/gameLogic';

interface XPBarProps {
  totalXP: number;
  className?: string;
}

export default function XPBar({ totalXP, className = '' }: XPBarProps) {
  const level = getLevelFromXP(totalXP);
  const { current, needed, percentage } = getXPProgress(totalXP);

  return (
    <div className={`${className}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-yellow-400 font-bold text-sm">Level {level}</span>
        <span className="text-gray-400 text-xs">{current} / {needed} XP</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-blue-400 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
