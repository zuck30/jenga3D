import React from 'react';
import { X, Book, HelpCircle, Lightbulb, Zap, Info } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-800/30">
          <div className="flex items-center gap-3 text-blue-400">
            <Book size={24} />
            <h2 className="text-xl font-black italic tracking-tight text-white uppercase">Jenga3D Explainer</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-xl text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          <section>
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <HelpCircle size={16} /> How it Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50">
                <h4 className="text-white font-bold text-sm mb-1">1. Build</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Use the <strong>Add State (A)</strong> tool to place spheres. Use <strong>Add Transition (T)</strong> to link them by clicking the source then target.
                </p>
              </div>
              <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50">
                <h4 className="text-white font-bold text-sm mb-1">2. Configure</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Select a state to set it as <strong>Initial</strong> or <strong>Final</strong>. Edit transition labels (e.g., "0", "1", or "ε").
                </p>
              </div>
              <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50">
                <h4 className="text-white font-bold text-sm mb-1">3. Simulate</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Enter a string and hit <strong>Run</strong>. Watch the particle travel! Green result = Accept, Red = Reject.
                </p>
              </div>
              <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50">
                <h4 className="text-white font-bold text-sm mb-1">4. Transform</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Use the <strong>Algorithm (Zap)</strong> menu to auto-convert NFA to DFA or minimize your machine.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Lightbulb size={16} className="text-yellow-500" /> Solving Tips
            </h3>
            <ul className="space-y-3">
              <li className="flex gap-3 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <p className="text-slate-300"><strong className="text-white">Dead States:</strong> In DFAs, every state must have a transition for every symbol in the alphabet. Use a "sink" state if needed.</p>
              </li>
              <li className="flex gap-3 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <p className="text-slate-300"><strong className="text-white">NFA Power:</strong> NFAs can have multiple transitions for the same symbol. This allows you to explore multiple paths simultaneously.</p>
              </li>
              <li className="flex gap-3 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <p className="text-slate-300"><strong className="text-white">Epsilon (ε):</strong> Use ε-transitions to move between states without consuming any input. Useful for merging machines.</p>
              </li>
            </ul>
          </section>

          <section className="p-6 bg-blue-600/10 border border-blue-500/20 rounded-2xl">
            <h3 className="text-sm font-bold text-blue-400 mb-2 flex items-center gap-2">
              <Info size={16} /> Keyboard Shortcuts
            </h3>
            <div className="grid grid-cols-2 gap-y-2 text-[10px] font-mono text-slate-400">
              <div>[S] Select Mode</div>
              <div>[A] Add State</div>
              <div>[T] Add Transition</div>
              <div>[DEL] Delete Mode</div>
            </div>
          </section>
        </div>

        <div className="px-8 py-5 bg-slate-800/50 border-t border-slate-800 text-center">
            <button
                onClick={onClose}
                className="px-8 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20"
            >
                Got it!
            </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
