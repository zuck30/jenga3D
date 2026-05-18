import React, { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { Html, QuadraticBezierLine } from '@react-three/drei';
import * as THREE from 'three';
import { Transition } from '../../types/automaton';
import { useStore } from '../../store/useStore';

interface TransitionCurveProps {
  transition: Transition;
}

const TransitionCurve: React.FC<TransitionCurveProps> = ({ transition }) => {
  const { automaton, selectedElement, setSelectedElement, mode, deleteTransition } = useStore();

  const sourceState = automaton.states.find((s) => s.id === transition.sourceId);
  const targetState = automaton.states.find((s) => s.id === transition.targetId);

  if (!sourceState || !targetState) return null;

  const isSelected = selectedElement?.id === transition.id;
  const isSelfLoop = transition.sourceId === transition.targetId;

  const { start, end, mid } = useMemo(() => {
    const s = new THREE.Vector3(...sourceState.position);
    const e = new THREE.Vector3(...targetState.position);

    let m = new THREE.Vector3().addVectors(s, e).multiplyScalar(0.5);

    if (isSelfLoop) {
        // Offset for self loops
        m.y += 2;
        m.x += 1;
        // Adjust start and end to be on the sphere surface slightly differently
    } else {
        // Curve it slightly so bidirectional transitions don't overlap
        const direction = new THREE.Vector3().subVectors(e, s).normalize();
        const normal = new THREE.Vector3(0, 1, 0).cross(direction).normalize();
        if (normal.length() === 0) normal.set(1, 0, 0); // fallback if vertical

        // Check if there's a reverse transition
        const hasReverse = automaton.transitions.some(
            t => t.sourceId === transition.targetId && t.targetId === transition.sourceId
        );

        if (hasReverse) {
            m.add(normal.multiplyScalar(1.5));
        } else {
            m.add(normal.multiplyScalar(0.5));
        }
    }

    return { start: s, end: e, mid: m };
  }, [sourceState.position, targetState.position, isSelfLoop, automaton.transitions, transition]);

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (mode === 'delete') {
      deleteTransition(transition.id);
      return;
    }
    setSelectedElement({ id: transition.id, type: 'transition' });
  };

  return (
    <group onClick={handleClick}>
      <QuadraticBezierLine
        start={start}
        end={end}
        mid={mid}
        color={isSelected ? "#facc15" : (transition.label === 'ε' ? "#a855f7" : "#94a3b8")}
        lineWidth={2}
        dashed={transition.label === 'ε'}
        dashScale={2}
        gapSize={0.5}
      />

      {/* Invisible thicker line for better click detection */}
      <QuadraticBezierLine
        start={start}
        end={end}
        mid={mid}
        color="transparent"
        lineWidth={10}
        transparent
        opacity={0}
      />

      <Html position={mid} center distanceFactor={10}>
        <div className={`
          px-1.5 py-0.5 rounded-full bg-slate-800 text-white text-[10px] font-bold select-none cursor-pointer
          border ${isSelected ? 'border-yellow-400' : 'border-slate-600'}
          hover:bg-slate-700 transition-colors
        `}>
          {transition.label}
        </div>
      </Html>
    </group>
  );
};

export default TransitionCurve;
