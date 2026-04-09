"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Points, PointMaterial, PresentationControls } from "@react-three/drei";
import * as THREE from "three";

interface OrbProps {
  intensity: number;
  avgIntensity: number;
  isColliding: boolean;
  selected?: boolean;
  currentAgentId?: string;
  isStreaming?: boolean;
}

function DataCloud({ isColliding }: { isColliding: boolean }) {
  const points = useMemo(() => {
    const p = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      p[i * 3] = (Math.random() - 0.5) * 20;
      p[i * 3 + 1] = (Math.random() - 0.5) * 20;
      p[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return p;
  }, []);

  const ref = useRef<THREE.Points>(null!);
  const col = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    ref.current.rotation.y = state.clock.getElapsedTime() * (isColliding ? 0.3 : 0.05);
    ref.current.rotation.x = state.clock.getElapsedTime() * 0.02;
    col.set(isColliding ? "#ff2a6d" : "#00f0ff");
    (ref.current.material as THREE.PointsMaterial).color.lerp(col, 0.1);
    (ref.current.material as THREE.PointsMaterial).size = isColliding ? 0.04 : 0.02;
  });

  return (
    <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00f0ff"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={isColliding ? 0.8 : 0.4}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function GridOverlay({ isColliding }: { isColliding: boolean }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((state) => {
    ref.current.rotation.z = state.clock.getElapsedTime() * 0.1;
    ref.current.scale.setScalar(1 + Math.sin(state.clock.getElapsedTime() * 2) * 0.05);
  });

  return (
    <group ref={ref}>
       <gridHelper args={[20, 20, isColliding ? "#ff2a6d" : "#00f0ff", isColliding ? "#ff2a6d" : "#003344"]} rotation={[Math.PI / 2, 0, 0]} />
    </group>
  );
}

function NeuralNodes({ avgIntensity, isColliding, currentAgentId }: { avgIntensity: number, isColliding: boolean, currentAgentId?: string }) {
  const nodes = useMemo(() => {
    // 6 Specialist positions in a hexagonal ring
    return [...Array(6)].map((_, i) => {
      const angle = (i / 6) * Math.PI * 2;
      const id = `agent-${i + 1}`;
      return {
        id,
        angle,
        pos: new THREE.Vector3(
          Math.cos(angle) * 4,
          Math.sin(angle) * 4,
          (Math.random() - 0.5) * 2
        ),
        speed: 0.5 + Math.random() * 0.5
      };
    });
  }, []);

  const lineRef = useRef<THREE.LineSegments>(null!);
  const nodeGroupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    nodeGroupRef.current.children.forEach((child, i) => {
      const node = nodes[i];
      const isActive = node.id === currentAgentId;
      
      const bounce = Math.sin(t * node.speed) * 0.2;
      const targetX = Math.cos(node.angle + t * 0.1) * (isActive ? 4.5 : 4);
      const targetY = Math.sin(node.angle + t * 0.1) * (isActive ? 4.5 : 4);
      
      child.position.x = THREE.MathUtils.lerp(child.position.x, targetX, 0.1);
      child.position.y = THREE.MathUtils.lerp(child.position.y, targetY, 0.1);
      child.position.z = THREE.MathUtils.lerp(child.position.z, bounce, 0.1);
      
      const scale = isActive ? 1.5 + Math.sin(t * 5) * 0.2 : 0.8;
      child.scale.setScalar(THREE.MathUtils.lerp(child.scale.x, scale, 0.1));
    });

    const positions = new Float32Array(nodes.length * 2 * 3);
    nodeGroupRef.current.children.forEach((child, i) => {
       // Root position (0,0,0)
       positions[i * 6] = 0;
       positions[i * 6 + 1] = 0;
       positions[i * 6 + 2] = 0;
       // Node position
       positions[i * 6 + 3] = child.position.x;
       positions[i * 6 + 4] = child.position.y;
       positions[i * 6 + 5] = child.position.z;
    });
    lineRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    // Pulse lines if any specialist is active
    (lineRef.current.material as THREE.LineBasicMaterial).opacity = currentAgentId?.startsWith('agent-') ? 0.4 : 0.15;
  });

  return (
    <group>
      <group ref={nodeGroupRef}>
        {nodes.map((node, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshBasicMaterial 
              color={node.id === currentAgentId ? "#00f2ff" : isColliding ? "#ff2a6d" : "#00f2ff"} 
              transparent 
              opacity={node.id === currentAgentId ? 1 : 0.3} 
            />
          </mesh>
        ))}
      </group>
      <lineSegments ref={lineRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#00f2ff" transparent opacity={0.2} />
      </lineSegments>
    </group>
  );
}

function CollisionOrb({ intensity, avgIntensity, isColliding, selected, currentAgentId, isStreaming }: OrbProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);
  
  const vec = useMemo(() => new THREE.Vector3(), []);
  const col = useMemo(() => new THREE.Color(), []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const { clock } = state;
    const t = clock.getElapsedTime();
    
    const isSupervisor = currentAgentId === 'supervisor';
    const isSigma = currentAgentId === 'agent-sigma';
    
    const breathe = Math.sin(t * (1 + avgIntensity * 2)) * 0.05;
    const s = (1.4 + intensity * 0.6 + breathe) * (isColliding ? 1.5 : 1) * (selected ? 1.4 : 1) * (isSigma ? 0.8 : 1);
    
    meshRef.current.scale.lerp(vec.set(s, s, s), 0.1);

    // Color logic
    if (isColliding) {
      col.set("#ff2a6d");
    } else if (isSigma) {
      col.set("#bc13fe"); // Purple for Clause Weaver
    } else if (isSupervisor) {
      col.set("#00f2ff"); // Cyan for Cortex
    } else if (currentAgentId?.startsWith('agent-')) {
      col.set("#00f2ff"); // Standard cyan for specialists
    } else {
      col.set("#00f2ff");
    }

    (meshRef.current.material as any).color.lerp(col, 0.05);

    meshRef.current.rotation.y += delta * (0.2 + avgIntensity * 0.5 + (isColliding ? 2 : 0));
    meshRef.current.rotation.z += delta * 0.1;

    if (glowRef.current) {
        glowRef.current.rotation.z = t * 0.4;
        glowRef.current.scale.setScalar(s * 1.5);
        (glowRef.current.material as any).opacity = THREE.MathUtils.lerp((glowRef.current.material as any).opacity, isStreaming ? 0.6 : 0.2, 0.1);
    }
    if (ringRef.current) {
        ringRef.current.rotation.x = t * 0.8;
        ringRef.current.rotation.y = t * 0.5;
        ringRef.current.scale.setScalar(s * 1.8);
    }
  });

  return (
    <group>
      <NeuralNodes avgIntensity={avgIntensity} isColliding={isColliding} currentAgentId={currentAgentId} />
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
        <Sphere ref={meshRef} args={[1, 64, 64]}>
          <MeshDistortMaterial
            color="#00f2ff"
            speed={2 + intensity * 6}
            distort={0.4 + intensity * 0.6}
            radius={1}
            emissive={isColliding ? "#ff2a6d" : (currentAgentId === 'agent-sigma' ? "#330044" : "#003344")}
            emissiveIntensity={isColliding ? 5 : 1}
            metalness={0.9}
            roughness={0.05}
          />
        </Sphere>
      </Float>

      <mesh ref={glowRef} rotation-x={Math.PI / 2}>
        <ringGeometry args={[1.2, 1.25, 64]} />
        <meshBasicMaterial color={isColliding ? "#ff2a6d" : (currentAgentId === 'agent-sigma' ? "#bc13fe" : "#00f2ff")} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      <mesh ref={ringRef}>
        <torusGeometry args={[1.4, 0.01, 16, 100]} />
        <meshBasicMaterial color={isColliding ? "#ff2a6d" : "#00f2ff"} transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

export default function ConflictScene({ intensity, avgIntensity, isColliding, selected, currentAgentId, isStreaming }: OrbProps) {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 10], fov: 40 }} dpr={1} gl={{ antialias: true }}>
        <ambientLight intensity={0.4} />
        <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={2} />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#0066ff" />
        
        <PresentationControls global snap rotation={[0, 0.3, 0]} polar={[-Math.PI / 4, Math.PI / 4]} azimuth={[-Math.PI / 2, Math.PI / 2]} >
           <GridOverlay isColliding={isColliding} />
           <DataCloud isColliding={isColliding} />
           <CollisionOrb 
             intensity={intensity} 
             avgIntensity={avgIntensity} 
             isColliding={isColliding} 
             selected={selected} 
             currentAgentId={currentAgentId}
             isStreaming={isStreaming}
           />
        </PresentationControls>
      </Canvas>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none radial-gradient-hud opacity-40" />
    </div>
  );
}
