import React, { useEffect, useState } from 'react';
import Scene3D from '../components/Canvas/Scene3D';
import Toolbar from '../components/UI/Toolbar';
import PropertiesPanel from '../components/UI/PropertiesPanel';
import SimulationControls from '../components/UI/SimulationControls';
import AchievementNotify from '../components/UI/AchievementNotify';
import ChallengeSidebar from '../components/UI/ChallengeSidebar';
import AchievementsGallery from './AchievementsGallery';
import { useStore } from '../store/useStore';

const ModeIndicator: React.FC = () => {
  const mode = useStore(s => s.mode);
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 pointer-events-none">
       <div className="px-3 py-1 bg-blue-600/10 border border-blue-500/20 rounded-full backdrop-blur-sm">
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
            Current Mode: <span className="text-white underline">{mode}</span>
          </p>
       </div>
    </div>
  );
};

const Editor: React.FC = () => {
  const setMode = useStore(s => s.setMode);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      switch (e.key.toLowerCase()) {
        case 's':
          setMode('select');
          break;
        case 'a':
          setMode('addState');
          break;
        case 't':
          setMode('addTransition');
          break;
        case 'delete':
        case 'backspace':
          setMode('delete');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setMode]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950 text-slate-200">
      {/* 3D Canvas */}
      <Scene3D />

      {/* UI Overlays */}
      <SimulationControls />
      <PropertiesPanel />
      <Toolbar onShowGallery={() => setShowGallery(true)} />
      <AchievementNotify />
      <ChallengeSidebar />

      {showGallery && <AchievementsGallery onClose={() => setShowGallery(false)} />}

      {/* Brand / Title */}
      <div className="fixed bottom-6 right-8 flex flex-col items-end pointer-events-none">
        <h1 className="text-4xl font-black italic tracking-tighter text-white/10 select-none">
          JENGA<span className="text-blue-500/20">3D</span>
        </h1>
        <p className="text-[10px] font-mono text-white/5 uppercase tracking-[0.3em]">
          Theory of Computation // v1.0.0
        </p>
      </div>

      {/* Mode Indicator */}
      <ModeIndicator />
    </div>
  );
};

export default Editor;
