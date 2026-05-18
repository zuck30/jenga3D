import React from 'react';
import {
  MousePointer2,
  PlusCircle,
  ArrowUpRight,
  Trash2,
  Play,
  Square,
  Save,
  Upload,
  Share2,
  Trophy,
  Zap,
  HelpCircle
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { saveAutomatonToFile } from '../../utils/saveLoad';
import { generateAchievementCard, downloadDataUrl } from '../../utils/cardGenerator';

interface ToolbarProps {
  onShowGallery?: () => void;
  onShowHelp?: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onShowGallery, onShowHelp }) => {
  const mode = useStore(s => s.mode);
  const setMode = useStore(s => s.setMode);
  const simulation = useStore(s => s.simulation);
  const startSimulation = useStore(s => s.startSimulation);
  const stopSimulation = useStore(s => s.stopSimulation);
  const runNFAToDFA = useStore(s => s.runNFAToDFA);
  const runEliminateEpsilon = useStore(s => s.runEliminateEpsilon);
  const runMinimizeDFA = useStore(s => s.runMinimizeDFA);
  const createFromRegex = useStore(s => s.createFromRegex);
  const automaton = useStore(s => s.automaton);

  const [regex, setRegex] = React.useState('');

  const handleSave = () => {
      saveAutomatonToFile(automaton);
  };

  const handleShare = async () => {
      const canvas = document.querySelector('canvas');
      if (canvas) {
          const card = await generateAchievementCard(canvas, "Current Automaton", "Built with Jenga3D");
          downloadDataUrl(card, `jenga3d-share-${Date.now()}.png`);
      }
  };

  const tools = [
    { id: 'select', icon: <MousePointer2 size={20} />, label: 'Select (S)', shortcut: 's' },
    { id: 'addState', icon: <PlusCircle size={20} />, label: 'Add State (A)', shortcut: 'a' },
    { id: 'addTransition', icon: <ArrowUpRight size={20} />, label: 'Add Transition (T)', shortcut: 't' },
    { id: 'delete', icon: <Trash2 size={20} />, label: 'Delete (Del)', shortcut: 'delete' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-wrap items-center justify-center gap-2 px-4 py-2 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl z-50 w-max max-w-[95vw]">
      <div className="flex items-center gap-1 pr-2 md:pr-4 border-r border-slate-700">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setMode(tool.id as any)}
            className={`
              p-2 rounded-xl transition-all duration-200 group relative
              ${mode === tool.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
            `}
            title={tool.label}
          >
            {tool.icon}
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-700">
              {tool.label}
            </span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1 pl-2">
        {simulation.isRunning ? (
          <button
            onClick={stopSimulation}
            className="p-2 rounded-xl bg-red-600 text-white hover:bg-red-500 transition-colors"
            title="Stop Simulation"
          >
            <Square size={20} fill="currentColor" />
          </button>
        ) : (
          <button
            onClick={startSimulation}
            className="p-2 rounded-xl bg-green-600 text-white hover:bg-green-500 transition-colors"
            title="Run Simulation"
          >
            <Play size={20} fill="currentColor" />
          </button>
        )}

        <div className="w-px h-6 bg-slate-700 mx-2" />

        <button
          onClick={onShowGallery}
          className="p-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          title="Achievement Gallery"
        >
          <Trophy size={20} />
        </button>

        <button
          onClick={onShowHelp}
          className="p-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          title="Help & Guide"
        >
          <HelpCircle size={20} />
        </button>

        <div className="group relative">
           <button className="p-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-slate-200" title="Algorithms">
            <Zap size={20} />
          </button>
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 rounded-xl p-2 hidden group-hover:block w-48 shadow-2xl">
              <button onClick={runEliminateEpsilon} className="w-full text-left px-3 py-2 text-[10px] font-bold text-slate-300 hover:bg-slate-800 rounded-lg">ε-NFA → NFA</button>
              <button onClick={runNFAToDFA} className="w-full text-left px-3 py-2 text-[10px] font-bold text-slate-300 hover:bg-slate-800 rounded-lg">NFA → DFA</button>
              <button onClick={runMinimizeDFA} className="w-full text-left px-3 py-2 text-[10px] font-bold text-slate-300 hover:bg-slate-800 rounded-lg">Minimize DFA</button>
          </div>
        </div>

        <button
            onClick={handleSave}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            title="Save"
        >
          <Save size={20} />
        </button>
        <button
            onClick={handleShare}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            title="Share Card"
        >
          <Share2 size={20} />
        </button>

        <div className="w-px h-6 bg-slate-700 mx-2" />

        <div className="flex items-center gap-2 bg-slate-800/50 rounded-xl px-2 py-1 border border-slate-700">
           <input
              type="text"
              placeholder="Regex (e.g. (0|1)*0)"
              value={regex}
              onChange={(e) => setRegex(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-[10px] text-slate-300 w-24"
           />
           <button
            onClick={() => createFromRegex(regex)}
            className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase"
           >
             Build
           </button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
