import React, { useRef } from 'react';
import { Canvas, useThree, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Grid, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { useStore } from '../../store/useStore';
import StateSphere from './StateSphere';
import TransitionCurve from './TransitionCurve';

const SceneContent: React.FC = () => {
  const { automaton, mode, addState, setSelectedElement } = useStore();
  const controlsRef = useRef<any>(null);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    // Only add state if clicking the background (not a state)
    if (e.intersections.length === 0 || e.intersections[0].object.name === 'background-grid') {
       if (mode === 'addState') {
        const point = e.point;
        addState([point.x, point.y, point.z]);
      } else {
        setSelectedElement(null);
      }
    }
  };

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enabled={mode === 'select' || mode === 'addState'}
      />

      <PerspectiveCamera makeDefault position={[10, 10, 10]} />

      <Environment preset="city" />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

      <mesh
        name="background-grid"
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerDown={handlePointerDown}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <Grid
        infiniteGrid
        fadeDistance={50}
        fadeStrength={5}
        sectionSize={3}
        cellSize={1}
      />

      <group>
        {automaton.states.map((state) => (
          <StateSphere key={state.id} state={state} />
        ))}
        {automaton.transitions.map((transition) => (
          <TransitionCurve key={transition.id} transition={transition} />
        ))}
      </group>

      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={0.4}
        scale={20}
        blur={2}
        far={4.5}
      />
    </>
  );
};

const Scene3D: React.FC = () => {
  return (
    <div className="w-full h-full bg-slate-900">
      <Canvas shadows gl={{ preserveDrawingBuffer: true }}>
        <SceneContent />
      </Canvas>
    </div>
  );
};

export default Scene3D;
