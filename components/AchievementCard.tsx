'use client';

interface AchievementCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export default function AchievementCard({ title, description, icon, unlocked, unlockedAt }: AchievementCardProps) {
  return (
    <div
      className={`bg-gray-800 rounded-xl p-4 border transition-all duration-300 flex flex-col items-center text-center gap-2 ${
        unlocked
          ? 'border-yellow-500/40 shadow-lg shadow-yellow-500/10'
          : 'border-gray-700 opacity-50 grayscale'
      }`}
    >
      <span className={`text-3xl ${unlocked ? '' : 'opacity-40'}`}>{icon}</span>
      <div>
        <p className={`font-semibold text-sm ${unlocked ? 'text-white' : 'text-gray-500'}`}>{title}</p>
        <p className="text-gray-400 text-xs mt-0.5">{description}</p>
      </div>
      {unlocked && unlockedAt && (
        <p className="text-gray-600 text-xs">
          {new Date(unlockedAt).toLocaleDateString()}
        </p>
      )}
      {!unlocked && (
        <span className="text-gray-600 text-xs">🔒 Locked</span>
      )}
    </div>
  );
}
