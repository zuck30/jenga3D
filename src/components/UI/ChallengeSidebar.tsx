import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { ChevronRight, ChevronLeft, Target, CheckCircle } from 'lucide-react';

const ChallengeSidebar: React.FC = () => {
  const challenges = useStore(s => s.challenges);
  const loadChallenge = useStore(s => s.loadChallenge);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`fixed top-0 left-0 h-full bg-slate-900/95 backdrop-blur-xl border-r border-slate-700 transition-all duration-300 z-50 ${isOpen ? 'w-80' : 'w-0'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-1/2 -right-10 w-10 h-20 bg-slate-900 border border-l-0 border-slate-700 rounded-r-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors"
      >
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {isOpen && (
        <div className="p-6 h-full flex flex-col">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              <Target className="text-blue-500" />
              Challenges
            </h2>
            <p className="text-xs text-slate-400">Master the theory of computation</p>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-blue-500/50 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                    {challenge.title}
                  </h3>
                  {challenge.isCompleted && (
                    <CheckCircle size={16} className="text-green-500" />
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {challenge.description}
                </p>

                <button
                  onClick={() => loadChallenge(challenge.id)}
                  className="mt-4 w-full py-2 bg-slate-700 hover:bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  Start Challenge
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeSidebar;
