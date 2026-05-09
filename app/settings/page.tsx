'use client';
import { useState } from 'react';
import { useProfile, useHabits } from '@/lib/store';

export default function SettingsPage() {
  const [profile, setProfile] = useProfile();
  const [habits] = useHabits();
  const [name, setName] = useState(profile.name);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveName = () => {
    if (name.trim()) {
      setProfile({ ...profile, name: name.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleReset = () => {
    if (showResetConfirm) {
      localStorage.clear();
      window.location.reload();
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 5000);
    }
  };

  const joinedDate = new Date(profile.joinedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="space-y-8 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your profile and app data</p>
      </div>

      {/* Profile */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span>👤</span> Profile
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm block mb-1">Display Name</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                maxLength={30}
                placeholder="Your hero name"
              />
              <button
                onClick={handleSaveName}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  saved
                    ? 'bg-green-600 text-white'
                    : 'bg-purple-600 hover:bg-purple-500 text-white'
                }`}
              >
                {saved ? '✓ Saved!' : 'Save'}
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            <p>Joined: <span className="text-gray-300">{joinedDate}</span></p>
            <p className="mt-1">Total XP: <span className="text-yellow-400 font-bold">{profile.totalXP.toLocaleString()}</span></p>
            <p className="mt-1">Streak Freezes: <span className="text-blue-400 font-bold">❄️ {profile.streakFreezes}</span></p>
          </div>
        </div>
      </div>

      {/* Streak Freezes Info */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
          <span>❄️</span> Streak Freezes
        </h2>
        <p className="text-gray-400 text-sm">
          You have <span className="text-blue-400 font-bold">{profile.streakFreezes}</span> streak freeze(s) available.
          Streak freezes protect your habit streaks if you miss a day. (Feature coming soon!)
        </p>
      </div>

      {/* Data Stats */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span>📊</span> Data
        </h2>
        <div className="space-y-2 text-sm text-gray-400">
          <p>Habits: <span className="text-white">{habits.length}</span></p>
          <p>Achievements: <span className="text-white">{profile.achievements.length} / 8</span></p>
          <p>Storage: <span className="text-white">Local (no account needed)</span></p>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-red-900/40">
        <h2 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
          <span>⚠️</span> Danger Zone
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          Resetting will delete all habits, XP, levels, and achievements. This cannot be undone.
        </p>
        <button
          onClick={handleReset}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            showResetConfirm
              ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse'
              : 'border border-red-700 text-red-400 hover:bg-red-900/30'
          }`}
        >
          {showResetConfirm ? '⚠️ Click again to confirm reset' : 'Reset All Data'}
        </button>
      </div>

      {/* About */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
          <span>ℹ️</span> About
        </h2>
        <div className="space-y-1 text-sm text-gray-400">
          <p>HabitQuest v1.0.0</p>
          <p>Built with Next.js 14, TypeScript, Tailwind CSS</p>
          <p className="mt-2 text-gray-500">All data stored locally in your browser.</p>
        </div>
      </div>
    </div>
  );
}
