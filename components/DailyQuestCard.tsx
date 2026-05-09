'use client';
import { DailyQuest } from '@/lib/types';

interface DailyQuestCardProps {
  quest: DailyQuest;
}

export default function DailyQuestCard({ quest }: DailyQuestCardProps) {
  return (
    <div
      className={`bg-gray-800 rounded-xl p-4 border transition-all duration-300 ${
        quest.completed
          ? 'border-green-500/40 opacity-75'
          : 'border-gray-700 hover:border-yellow-500/40'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold ${quest.completed ? 'line-through text-gray-500' : 'text-white'}`}>
              {quest.title}
            </span>
            {quest.completed && (
              <span className="text-green-400 text-xs bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/30">
                Done!
              </span>
            )}
          </div>
          <p className="text-gray-400 text-xs mt-0.5">{quest.description}</p>
        </div>
        <div className={`text-right flex-shrink-0 ${quest.completed ? 'opacity-50' : ''}`}>
          <div className="text-yellow-400 font-bold text-sm">+{quest.xpReward}</div>
          <div className="text-gray-500 text-xs">XP</div>
        </div>
      </div>
    </div>
  );
}
