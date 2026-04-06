"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, Float } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

interface OrbProps {
  /** 0.0 – 1.0  driven by live delta_score from the SSE stream */
  intensity: number;
  /** whether the orb is actively "colliding" */
  isColliding: boolean;
}

function CollisionOrb({ intensity, isColliding }: OrbProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Base rotation
    meshRef.current.rotation.x = Math.sin(t / 2.5);
    meshRef.current.rotation.y = Math.cos(t / 3.5);

    // Scale pulse on collision
    const pulse = isColliding
      ? 1 + Math.sin(t * 12) * 0.06
      : 1 + Math.sin(t * 1.5) * 0.02;
    meshRef.current.scale.setScalar(1.5 * pulse);

    // Glow ring spin
    glowRef.current.rotation.z = t * 0.4;
  });

  // Gold → red based on delta intensity
  const goldHex = new THREE.Color("#C6A059");
  const redHex  = new THREE.Color("#FF4D4D");
  const orbColor = goldHex.clone().lerp(redHex, intensity);
  const emissiveIntensity = 0.2 + intensity * 0.7;

  return (
    <Float speed={4} rotationIntensity={1.5} floatIntensity={1.8}>
      {/* Core orb */}
      <Sphere ref={meshRef} args={[1, 128, 128]}>
        <MeshDistortMaterial
          color={orbColor}
          speed={3 + intensity * 5}
          distort={0.25 + intensity * 0.55}
          metalness={0.9}
          roughness={0.1}
          emissive={orbColor}
          emissiveIntensity={emissiveIntensity}
        />
      </Sphere>

      {/* Outer glow ring */}
      <mesh ref={glowRef}>
        <torusGeometry args={[2.2, 0.04, 16, 120]} />
        <meshBasicMaterial
          color="#00F5FF"
          transparent
          opacity={0.15 + intensity * 0.4}
        />
      </mesh>

      {/* Second ring for collision flare */}
      {isColliding && (
        <mesh>
          <torusGeometry args={[2.6, 0.02, 16, 120]} />
          <meshBasicMaterial color="#FF4D4D" transparent opacity={0.6} />
        </mesh>
      )}
    </Float>
  );
}

export default function ConflictScene({ intensity = 0, isColliding = false }: Partial<OrbProps>) {
  return (
    <div className="w-full h-[620px] absolute top-0 left-0 -z-10">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        {/* Cinematic dark lighting */}
        <ambientLight intensity={0.25} />
        <pointLight position={[8,  8, 8]}  intensity={1.5} color="#C6A059" />
        <pointLight position={[-8, 4, 6]}  intensity={1.0} color="#00F5FF" />
        <spotLight
          position={[0, 10, 0]}
          angle={0.25}
          penumbra={1}
          intensity={isColliding ? 3 : 1}
          color={isColliding ? "#FF4D4D" : "#C6A059"}
          castShadow
        />

        <CollisionOrb intensity={intensity} isColliding={isColliding} />
      </Canvas>
    </div>
  );
}
