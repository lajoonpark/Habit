'use client';
import { useEffect, useState } from 'react';

interface LevelUpModalProps {
  level: number;
  onClose: () => void;
}

export default function LevelUpModal({ level, onClose }: LevelUpModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-gray-800 border border-purple-500/50 rounded-2xl p-8 text-center shadow-2xl shadow-purple-500/20 transition-all duration-300 ${visible ? 'scale-100' : 'scale-90'}`}>
        <div className="text-5xl mb-3 animate-bounce">🎉</div>
        <h2 className="text-white text-2xl font-bold mb-1">Level Up!</h2>
        <p className="text-purple-400 text-4xl font-black mb-2">Lv. {level}</p>
        <p className="text-gray-400 text-sm">Keep up the amazing work!</p>
        <button
          onClick={onClose}
          className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
