'use client';
import { useState } from 'react';
import { useHabits } from '@/lib/store';
import { Habit, Difficulty } from '@/lib/types';
import { DIFFICULTY_XP, WEEK_DAYS, getHabitScheduleDays } from '@/lib/gameLogic';
import HabitCard from '@/components/HabitCard';

const ICONS = ['💪', '📚', '🧘', '🏃', '💧', '🥗', '😴', '✍️', '🎯', '🎸', '🌿', '💊', '🧹', '👨‍💻', '🙏', '🏊'];
const COLORS = ['#FF6B6B', '#4ECDC4', '#A8E6CF', '#FFD93D', '#6C5CE7', '#A29BFE', '#00B894', '#E17055', '#74B9FF', '#FD79A8'];

const DEFAULT_FORM = {
  name: '',
  description: '',
  difficulty: 'Normal' as Difficulty,
  color: '#6C5CE7',
  icon: '🎯',
  scheduleDays: [0, 1, 2, 3, 4, 5, 6] as number[],
};

export default function HabitsPage() {
  const [habits, setHabits] = useHabits();
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const openCreate = () => {
    setEditingHabit(null);
    setForm(DEFAULT_FORM);
    setShowForm(true);
  };

  const openEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setForm({
      name: habit.name,
      description: habit.description,
      difficulty: habit.difficulty,
      color: habit.color,
      icon: habit.icon,
      scheduleDays: getHabitScheduleDays(habit),
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (form.scheduleDays.length === 0) return;

    if (editingHabit) {
      setHabits(habits.map(h =>
        h.id === editingHabit.id
          ? { ...h, ...form, xpReward: DIFFICULTY_XP[form.difficulty] }
          : h
      ));
    } else {
      const newHabit: Habit = {
        id: Date.now().toString(),
        ...form,
        xpReward: DIFFICULTY_XP[form.difficulty],
        active: true,
        createdAt: new Date().toISOString(),
        completedDates: [],
        streak: 0,
        longestStreak: 0,
      };
      setHabits([...habits, newHabit]);
    }
    setShowForm(false);
    setEditingHabit(null);
  };

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      setHabits(habits.filter(h => h.id !== id));
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleToggleActive = (id: string) => {
    setHabits(habits.map(h => h.id === id ? { ...h, active: !h.active } : h));
  };

  const activeHabits = habits.filter(h => h.active);
  const inactiveHabits = habits.filter(h => !h.active);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Habits</h1>
          <p className="text-gray-400 text-sm mt-1">{habits.length} habits total · {activeHabits.length} active</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl font-medium text-sm transition-colors flex items-center gap-2"
        >
          <span>+</span> New Habit
        </button>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-white font-bold text-lg mb-4">
              {editingHabit ? 'Edit Habit' : 'Create New Habit'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm block mb-1">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                  placeholder="e.g., Morning Workout"
                  required
                  maxLength={50}
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                  placeholder="Optional description"
                  maxLength={100}
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">Difficulty</label>
                <select
                  value={form.difficulty}
                  onChange={e => setForm({ ...form, difficulty: e.target.value as Difficulty })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                >
                  {(['Easy', 'Normal', 'Hard', 'Epic'] as Difficulty[]).map(d => (
                    <option key={d} value={d}>{d} (+{DIFFICULTY_XP[d]} XP)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {ICONS.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setForm({ ...form, icon })}
                      className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-colors ${
                        form.icon === icon ? 'bg-purple-500/30 border-2 border-purple-500' : 'bg-gray-700 border border-gray-600 hover:bg-gray-600'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">Color</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setForm({ ...form, color })}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${form.color === color ? 'border-white scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">Schedule</label>
                <div className="flex flex-wrap gap-1.5">
                  {WEEK_DAYS.map((label, idx) => {
                    const selected = form.scheduleDays.includes(idx);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          const next = selected
                            ? form.scheduleDays.filter(d => d !== idx)
                            : [...form.scheduleDays, idx].sort((a, b) => a - b);
                          setForm({ ...form, scheduleDays: next });
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                          selected
                            ? 'bg-purple-500/30 border-purple-500 text-purple-300'
                            : 'bg-gray-700 border-gray-600 text-gray-400 hover:bg-gray-600'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                {form.scheduleDays.length === 0 && (
                  <p className="text-red-400 text-xs mt-1">Select at least one day.</p>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  {editingHabit ? 'Save Changes' : 'Create Habit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Active Habits */}
      <div>
        <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
          Active Habits ({activeHabits.length})
        </h2>
        {activeHabits.length === 0 ? (
          <div className="bg-gray-800 rounded-2xl p-8 text-center border border-gray-700">
            <p className="text-4xl mb-2">🌱</p>
            <p className="text-gray-400">No active habits. Create one to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeHabits.map(habit => (
              <div key={habit.id} className="relative">
                <HabitCard
                  habit={habit}
                  onComplete={() => {}}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  onToggleActive={handleToggleActive}
                  showActions
                />
                {deleteConfirm === habit.id && (
                  <div className="absolute inset-0 bg-red-900/80 rounded-xl flex items-center justify-center gap-3">
                    <p className="text-white text-sm">Delete &quot;{habit.name}&quot;?</p>
                    <button
                      onClick={() => handleDelete(habit.id)}
                      className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      Yes, Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inactive Habits */}
      {inactiveHabits.length > 0 && (
        <div>
          <h2 className="text-gray-500 font-semibold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-gray-600 rounded-full"></span>
            Inactive Habits ({inactiveHabits.length})
          </h2>
          <div className="space-y-3">
            {inactiveHabits.map(habit => (
              <div key={habit.id} className="relative opacity-60">
                <HabitCard
                  habit={habit}
                  onComplete={() => {}}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  onToggleActive={handleToggleActive}
                  showActions
                />
                {deleteConfirm === habit.id && (
                  <div className="absolute inset-0 bg-red-900/80 rounded-xl flex items-center justify-center gap-3">
                    <p className="text-white text-sm">Delete &quot;{habit.name}&quot;?</p>
                    <button
                      onClick={() => handleDelete(habit.id)}
                      className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      Yes, Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
