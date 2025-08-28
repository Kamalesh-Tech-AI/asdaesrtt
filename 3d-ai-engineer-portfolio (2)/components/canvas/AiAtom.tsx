/// <reference types="@react-three/fiber" />

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Torus } from '@react-three/drei';
import * as THREE from 'three';

const Electron: React.FC<{ radius: number; speed: number; color: string; }> = ({ radius, speed, color }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * speed;
      ref.current.position.x = Math.cos(t) * radius;
      ref.current.position.z = Math.sin(t) * radius;
    }
  });
  return (
    <Sphere ref={ref} args={[0.1, 16, 16]}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
    </Sphere>
  );
};

const AiAtom = () => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  const orbits = useMemo(() => [
    { radius: 2.5, rotation: [Math.PI / 2, 0, 0], speed: 1, color: '#2dd4bf' }, // teal-400
    { radius: 3.5, rotation: [Math.PI / 2, Math.PI / 3, 0], speed: 0.7, color: '#5eead4' }, // teal-300
    { radius: 4.5, rotation: [Math.PI / 2, -Math.PI / 3, 0], speed: 0.4, color: '#99f6e4' }, // teal-200
  ], []);

  return (
    <group ref={groupRef} scale={0.8}>
      {/* Nucleus */}
      <Sphere args={[1, 32, 32]}>
        <meshStandardMaterial
          color="#134e4a" // teal-800
          emissive="#14b8a6" // teal-500
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>

      {/* Orbits and Electrons */}
      {orbits.map((orbit, index) => (
        <group key={index} rotation={new THREE.Euler(...orbit.rotation)}>
          <Torus args={[orbit.radius, 0.02, 16, 100]}>
            <meshStandardMaterial color={orbit.color} emissive={orbit.color} emissiveIntensity={1} />
          </Torus>
          <Electron radius={orbit.radius} speed={orbit.speed} color={orbit.color} />
        </group>
      ))}
    </group>
  );
};

export default AiAtom;