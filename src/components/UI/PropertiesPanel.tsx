import React from 'react';
import { useStore } from '../../store/useStore';
import { X, Trash2, Info } from 'lucide-react';

const PropertiesPanel: React.FC = () => {
  const {
    selectedElement,
    setSelectedElement,
    automaton,
    updateState,
    updateTransition,
    deleteState,
    deleteTransition
  } = useStore();

  if (!selectedElement) return null;

  const isState = selectedElement.type === 'state';
  const element = isState
    ? automaton.states.find(s => s.id === selectedElement.id)
    : automaton.transitions.find(t => t.id === selectedElement.id);

  if (!element) return null;

  return (
    <div className="fixed top-6 right-6 w-72 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between bg-slate-800/50">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Info size={16} className="text-blue-400" />
          {isState ? 'State Properties' : 'Transition Properties'}
        </h3>
        <button
          onClick={() => setSelectedElement(null)}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 tracking-wider">
            Label
          </label>
          <input
            type="text"
            value={isState ? (element as any).name : (element as any).label}
            onChange={(e) => {
              if (isState) updateState(element.id, { name: e.target.value });
              else updateTransition(element.id, { label: e.target.value });
            }}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        {isState && (
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 tracking-wider">
              Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['normal', 'initial', 'final'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => updateState(element.id, { type })}
                  className={`
                    px-2 py-1.5 rounded-lg text-[10px] font-bold capitalize transition-all
                    ${(element as any).type === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-750'}
                  `}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2">
          <button
            onClick={() => {
              if (isState) deleteState(element.id);
              else deleteTransition(element.id);
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-900/20 text-red-400 border border-red-900/30 rounded-lg text-xs font-bold hover:bg-red-900/30 transition-all"
          >
            <Trash2 size={14} />
            Delete {isState ? 'State' : 'Transition'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
