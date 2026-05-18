import React from 'react';
import { useStore } from '../store/useStore';
import { Trophy, ArrowLeft, Download } from 'lucide-react';

interface AchievementsGalleryProps {
    onClose: () => void;
}

const AchievementsGallery: React.FC<AchievementsGalleryProps> = ({ onClose }) => {
  const achievements = useStore(s => s.achievements);
  const unlocked = achievements.filter(a => a.unlockedAt);

  return (
    <div className="fixed inset-0 bg-slate-950 z-[100] flex flex-col overflow-hidden">
      <header className="px-8 py-6 border-b border-slate-800 flex items-center justify-between">
        <button
            onClick={onClose}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
            <ArrowLeft size={20} />
            <span className="text-sm font-bold uppercase tracking-widest">Back to Editor</span>
        </button>

        <div className="flex items-center gap-3">
            <Trophy className="text-yellow-500" size={24} />
            <h1 className="text-2xl font-black italic tracking-tight">ACHIEVEMENTS</h1>
        </div>

        <div className="text-slate-500 text-xs font-mono">
            {unlocked.length} / {achievements.length} UNLOCKED
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-12 bg-[radial-gradient(circle_at_50%_50%,_#1e1b4b_0%,_#020617_100%)]">
        {unlocked.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <Trophy size={80} className="mb-6" />
                <h2 className="text-2xl font-bold mb-2">No Achievements Yet</h2>
                <p>Start building your first automaton to unlock achievements!</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {unlocked.map((achievement) => (
                    <div key={achievement.id} className="group relative aspect-[4/5] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-yellow-500/50 transition-all shadow-xl">
                        {achievement.image ? (
                            <img src={achievement.image} alt={achievement.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                                <Trophy size={48} className="text-yellow-500/20 mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">{achievement.title}</h3>
                                <p className="text-sm text-slate-500">{achievement.description}</p>
                            </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                            <button className="w-full py-3 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors">
                                <Download size={18} />
                                Download Card
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </main>
    </div>
  );
};

export default AchievementsGallery;
