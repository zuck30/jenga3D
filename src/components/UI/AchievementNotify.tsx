import React, { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { Trophy, X, Download } from 'lucide-react';
import confetti from 'canvas-confetti';

const AchievementNotify: React.FC = () => {
  const { achievements } = useStore();
  const [latest, setLatest] = useState<any>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const newlyUnlocked = achievements.find(a =>
      a.unlockedAt &&
      (new Date().getTime() - new Date(a.unlockedAt).getTime() < 5000)
    );

    if (newlyUnlocked && newlyUnlocked.id !== latest?.id) {
      setLatest(newlyUnlocked);
      setShow(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22d3ee', '#4ade80', '#fb923c']
      });

      const timer = setTimeout(() => setShow(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [achievements]);

  if (!latest || !show) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-10 duration-500">
      <div className="bg-slate-900 border-2 border-yellow-500/50 rounded-2xl p-1 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
        <div className="bg-slate-900 border border-slate-700 rounded-[14px] px-6 py-4 flex items-center gap-5">
          <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500 shrink-0">
            <Trophy size={28} />
          </div>

          <div className="flex-1 min-w-[200px]">
            <h4 className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.2em] mb-0.5">
              Achievement Unlocked
            </h4>
            <h3 className="text-white font-bold text-lg leading-tight">
              {latest.title}
            </h3>
            <p className="text-slate-400 text-xs">
              {latest.description}
            </p>
          </div>

          <button
            onClick={() => setShow(false)}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AchievementNotify;
