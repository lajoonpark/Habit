'use client';
import { useState } from 'react';
import { Habit } from '@/lib/types';
import { isCompletedToday } from '@/lib/gameLogic';

interface HabitCardProps {
  habit: Habit;
  onComplete: (id: string) => void;
  onEdit?: (habit: Habit) => void;
  onDelete?: (id: string) => void;
  onToggleActive?: (id: string) => void;
  showActions?: boolean;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: 'bg-green-500/20 text-green-400 border-green-500/30',
  Normal: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Hard: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Epic: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

export default function HabitCard({ habit, onComplete, onEdit, onDelete, onToggleActive, showActions = false }: HabitCardProps) {
  const [animating, setAnimating] = useState(false);
  const completed = isCompletedToday(habit);

  const handleComplete = () => {
    if (completed) return;
    setAnimating(true);
    setTimeout(() => setAnimating(false), 600);
    onComplete(habit.id);
  };

  return (
    <div
      className={`bg-gray-800 rounded-xl p-4 shadow-lg border transition-all duration-300 ${
        completed ? 'border-green-500/40 opacity-75' : 'border-gray-700 hover:border-gray-600'
      } ${animating ? 'scale-105' : 'scale-100'}`}
      style={{ borderLeftColor: habit.color, borderLeftWidth: '4px' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-2xl flex-shrink-0">{habit.icon}</span>
          <div className="min-w-0">
            <h3 className={`font-semibold truncate ${completed ? 'line-through text-gray-500' : 'text-white'}`}>
              {habit.name}
            </h3>
            <p className="text-gray-400 text-xs truncate">{habit.description}</p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className={`text-xs px-2 py-0.5 rounded-full border ${DIFFICULTY_COLORS[habit.difficulty]}`}>
                {habit.difficulty}
              </span>
              <span className="text-yellow-400 text-xs font-medium">+{habit.xpReward} XP</span>
              {habit.streak > 0 && (
                <span className="text-orange-400 text-xs flex items-center gap-0.5">
                  🔥 {habit.streak}d
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {showActions && (
            <>
              <button
                onClick={() => onToggleActive?.(habit.id)}
                className={`text-xs px-2 py-1 rounded-lg border transition-colors ${
                  habit.active
                    ? 'border-green-500/40 text-green-400 hover:bg-green-500/10'
                    : 'border-gray-600 text-gray-500 hover:bg-gray-700'
                }`}
                title={habit.active ? 'Active' : 'Inactive'}
              >
                {habit.active ? '✓ Active' : '○ Inactive'}
              </button>
              <button
                onClick={() => onEdit?.(habit)}
                className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-700 transition-colors"
                title="Edit"
              >
                ✏️
              </button>
              <button
                onClick={() => onDelete?.(habit.id)}
                className="text-gray-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-gray-700 transition-colors"
                title="Delete"
              >
                🗑️
              </button>
            </>
          )}
          <button
            onClick={handleComplete}
            disabled={completed}
            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
              completed
                ? 'border-green-500 bg-green-500/20 text-green-400'
                : 'border-gray-600 hover:border-purple-400 hover:bg-purple-500/10 text-gray-400 hover:text-purple-400'
            }`}
          >
            {completed ? '✓' : '○'}
          </button>
        </div>
      </div>
    </div>
  );
}
