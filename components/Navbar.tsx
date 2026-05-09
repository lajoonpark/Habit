'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useProfile } from '@/lib/store';
import { getLevelFromXP } from '@/lib/gameLogic';

export default function Navbar() {
  const [profile] = useProfile();
  const pathname = usePathname();
  const level = getLevelFromXP(profile.totalXP);

  const links = [
    { href: '/', label: 'Dashboard', icon: '🏠' },
    { href: '/habits', label: 'Habits', icon: '✅' },
    { href: '/progress', label: 'Progress', icon: '📊' },
    { href: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <span className="text-white font-bold text-xl">HabitQuest</span>
        </div>
        <div className="flex items-center gap-1">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                pathname === link.href
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span>{link.icon}</span>
              <span className="hidden sm:inline">{link.label}</span>
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-full">
          <span className="text-yellow-400 text-sm font-bold">Lv.{level}</span>
          <span className="text-gray-400 text-xs">{profile.name}</span>
        </div>
      </div>
    </nav>
  );
}
