import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Trail } from '@react-three/drei';
import * as THREE from 'three';

interface ParticleProps {
  start: [number, number, number];
  end: [number, number, number];
  mid: [number, number, number];
  duration?: number;
  onComplete?: () => void;
}

const Particle: React.FC<ParticleProps> = ({ start, end, mid, duration = 1, onComplete }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const startTime = useRef(Date.now());

  const curve = useMemo(() => {
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...start),
      new THREE.Vector3(...mid),
      new THREE.Vector3(...end)
    );
  }, [start, end, mid]);

  useFrame(() => {
    const elapsed = (Date.now() - startTime.current) / 1000;
    const t = Math.min(elapsed / duration, 1);

    const pos = curve.getPoint(t);
    meshRef.current.position.copy(pos);

    if (t >= 1) {
      if (onComplete) onComplete();
    }
  });

  return (
    <Trail
      width={1}
      length={5}
      color={new THREE.Color('#fb923c')}
      attenuation={(t) => t * t}
    >
      <Sphere ref={meshRef} args={[0.15, 16, 16]}>
        <meshStandardMaterial
          color="#fb923c"
          emissive="#fb923c"
          emissiveIntensity={5}
        />
      </Sphere>
    </Trail>
  );
};

export default Particle;
