import React from 'react';
import { useStore } from '../../store/useStore';
import { Play, SkipForward, RotateCcw, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

const SimulationControls: React.FC = () => {
  const {
    simulation,
    setSimulationInput,
    startSimulation,
    stepSimulation,
    resetSimulation,
    automaton
  } = useStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSimulationInput(e.target.value);
  };

  const isDFA = automaton.type === 'DFA';
  const currentStep = simulation.currentIndex;
  const totalSteps = simulation.inputString.length;

  return (
    <div className="fixed top-6 left-6 flex flex-col gap-3 z-50">
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-2xl p-4 shadow-2xl w-80">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Play size={14} className="text-green-500" />
            Simulation
          </h3>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isDFA ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
            {automaton.type}
          </span>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter input string (e.g. 0101)"
              value={simulation.inputString}
              onChange={handleInputChange}
              disabled={simulation.isRunning}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
            />
            {simulation.isRunning && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                {simulation.inputString.split('').map((char, i) => (
                  <span
                    key={i}
                    className={`text-xs font-mono font-bold ${i === currentStep ? 'text-orange-400 underline underline-offset-4' : i < currentStep ? 'text-slate-500' : 'text-slate-200'}`}
                  >
                    {char}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {!simulation.isRunning ? (
              <button
                onClick={startSimulation}
                className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <Play size={14} fill="currentColor" />
                Run
              </button>
            ) : (
              <>
                <button
                  onClick={stepSimulation}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <SkipForward size={14} fill="currentColor" />
                  Step
                </button>
                <button
                  onClick={resetSimulation}
                  className="px-3 bg-slate-800 hover:bg-slate-750 text-slate-300 py-2 rounded-xl text-xs font-bold transition-all"
                >
                  <RotateCcw size={14} />
                </button>
              </>
            )}
          </div>
        </div>

        {simulation.result && (
          <div className={`mt-4 p-3 rounded-xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300
            ${simulation.result === 'accepted'
              ? 'bg-green-500/10 border-green-500/30 text-green-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'}
          `}>
            {simulation.result === 'accepted' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            <div>
              <p className="text-xs font-bold uppercase tracking-tight">
                String {simulation.result === 'accepted' ? 'Accepted' : 'Rejected'}
              </p>
              <p className="text-[10px] opacity-80 leading-tight">
                {simulation.result === 'accepted'
                  ? 'Automaton reached a final state.'
                  : 'Automaton ended in a non-final state.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulationControls;
