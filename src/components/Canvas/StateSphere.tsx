import React, { useRef, useState } from 'react';
import { useThree, ThreeEvent } from '@react-three/fiber';
import { Html, Sphere, TransformControls } from '@react-three/drei';
import * as THREE from 'three';
import { State } from '../../types/automaton';
import { useStore } from '../../store/useStore';

interface StateSphereProps {
  state: State;
}

const StateSphere: React.FC<StateSphereProps> = ({ state }) => {
  const {
    selectedElement,
    setSelectedElement,
    mode,
    updateState,
    deleteState,
    simulation,
    addTransition,
    automaton
  } = useStore();

  const [isHovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null!);

  const isSelected = selectedElement?.id === state.id;
  const isActive = simulation.currentStates.includes(state.id);

  const getColor = () => {
    if (isActive) return '#fb923c'; // orange-400
    if (state.type === 'initial') return '#4ade80'; // green-400
    if (state.type === 'final') return '#f87171'; // red-400
    return '#22d3ee'; // cyan-400
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();

    if (mode === 'delete') {
      deleteState(state.id);
      return;
    }

    if (mode === 'addTransition') {
      if (selectedElement?.type === 'state') {
        // Create transition from previous selected to this one
        addTransition(selectedElement.id, state.id, '0');
        setSelectedElement(null);
      } else {
        setSelectedElement({ id: state.id, type: 'state' });
      }
      return;
    }

    setSelectedElement({ id: state.id, type: 'state' });
  };

  const groupRef = useRef<THREE.Group>(null!);

  return (
    <>
      {isSelected && mode === 'select' ? (
        <TransformControls
          object={groupRef.current}
          mode="translate"
          onObjectChange={() => {
            if (groupRef.current) {
              const { x, y, z } = groupRef.current.position;
              updateState(state.id, { position: [x, y, z] });
            }
          }}
        />
      ) : null}

      <group ref={groupRef} position={state.position}>
        <Sphere
          ref={meshRef}
          args={[0.5, 32, 32]}
          onClick={handleClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <meshStandardMaterial
            color={getColor()}
            emissive={isActive || isHovered ? getColor() : '#000'}
            emissiveIntensity={isActive ? 2 : (isHovered ? 0.5 : 0)}
            metalness={0.6}
            roughness={0.2}
          />

          {state.type === 'final' && (
            <Sphere args={[0.6, 32, 32]}>
              <meshStandardMaterial
                color="#f87171"
                transparent
                opacity={0.3}
                wireframe
              />
            </Sphere>
          )}
        </Sphere>

        <Html position={[0, 0.8, 0]} center distanceFactor={10}>
          <div className={`
            px-2 py-0.5 rounded bg-black/60 text-white text-xs font-mono select-none cursor-pointer
            border ${isSelected ? 'border-yellow-400' : 'border-white/20'}
          `}>
            {state.name}
            {state.type === 'initial' && ' (start)'}
          </div>
        </Html>

        {isActive && (
            <pointLight distance={3} intensity={5} color="#fb923c" />
        )}
      </group>
    </>
  );
};

export default StateSphere;
