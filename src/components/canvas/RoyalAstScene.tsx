"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

interface RoyalAstSceneProps {
  isSimulating?: boolean;
  onSimulateComplete?: () => void;
}

// Cubic Bezier curve for the neural bridge
function GoldenNeuralBridge({
  start,
  end,
  isSimulating,
}: {
  start: [number, number, number];
  end: [number, number, number];
  isSimulating: boolean;
}) {
  const pulseRef = useRef<THREE.Mesh>(null);
  const pulseProgress = useRef(0);
  const pulseLightRef = useRef<THREE.PointLight>(null);

  const curve = useMemo(() => {
    const vStart = new THREE.Vector3(...start);
    const vEnd = new THREE.Vector3(...end);
    const mid1 = new THREE.Vector3(
      start[0] + (end[0] - start[0]) * 0.35,
      start[1] + 2.2,
      start[2] + 1.2
    );
    const mid2 = new THREE.Vector3(
      start[0] + (end[0] - start[0]) * 0.65,
      end[1] - 1.8,
      start[2] - 1.0
    );
    return new THREE.CubicBezierCurve3(vStart, mid1, mid2, vEnd);
  }, [start, end]);

  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 72, 0.045, 12, false);
  }, [curve]);

  useFrame((_, delta) => {
    if (!pulseRef.current) return;
    const speed = isSimulating ? 1.4 : 0.28;
    pulseProgress.current = (pulseProgress.current + delta * speed) % 1;

    const point = curve.getPoint(pulseProgress.current);
    pulseRef.current.position.copy(point);

    if (pulseLightRef.current) {
      pulseLightRef.current.position.copy(point);
      pulseLightRef.current.intensity = isSimulating ? 3.5 : 1.2;
    }
  });

  return (
    <group>
      {/* Golden Conduit Tube */}
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial
          color="#996515"
          emissive="#D4AF37"
          emissiveIntensity={0.45}
          metalness={0.96}
          roughness={0.18}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Pulsing Liquid Gold Bead */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.16, 24, 24]} />
        <meshStandardMaterial
          color="#F3E5AB"
          emissive="#FAF9F6"
          emissiveIntensity={isSimulating ? 3.2 : 1.8}
          metalness={0.99}
          roughness={0.05}
        />
      </mesh>

      <pointLight
        ref={pulseLightRef}
        color="#F3E5AB"
        distance={4.5}
        decay={2}
        intensity={1.5}
      />
    </group>
  );
}

// Dark Obsidian Polyhedron Node (Producer or Consumer)
function ObsidianNode({
  position,
  role,
  isFractured,
  isHealed,
}: {
  position: [number, number, number];
  role: "producer" | "consumer";
  isFractured?: boolean;
  isHealed?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
      meshRef.current.rotation.x += delta * 0.2;
    }
    if (ringRef1.current) {
      ringRef1.current.rotation.z += delta * 0.7;
      ringRef1.current.rotation.x += delta * 0.35;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.y -= delta * 0.55;
      ringRef2.current.rotation.z += delta * 0.25;
    }
  });

  const nodeColor = isFractured && !isHealed ? "#2c0e12" : "#0e0e13";
  const emissiveColor = isFractured && !isHealed ? "#ef4444" : isHealed ? "#D4AF37" : "#996515";
  const emissiveIntensity = isFractured && !isHealed ? 0.9 : isHealed ? 1.6 : 0.3;

  return (
    <group position={position}>
      {/* Obsidian Polyhedron */}
      <mesh ref={meshRef}>
        <octahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial
          color={nodeColor}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
          metalness={0.94}
          roughness={0.16}
        />
      </mesh>

      {/* Digital Kintsugi Golden Veins (Visible when healing/healed or active) */}
      <mesh scale={1.04}>
        <octahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial
          wireframe
          color="#D4AF37"
          emissive="#F3E5AB"
          emissiveIntensity={isHealed ? 1.8 : 0.4}
          transparent
          opacity={isHealed ? 0.85 : 0.3}
        />
      </mesh>

      {/* Golden Orbital Ring 1 */}
      <mesh ref={ringRef1}>
        <torusGeometry args={[1.75, 0.022, 16, 64]} />
        <meshStandardMaterial
          color="#D4AF37"
          emissive="#996515"
          emissiveIntensity={0.6}
          metalness={0.98}
          roughness={0.12}
        />
      </mesh>

      {/* Golden Orbital Ring 2 */}
      <mesh ref={ringRef2} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.05, 0.016, 16, 64]} />
        <meshStandardMaterial
          color="#F3E5AB"
          emissive="#D4AF37"
          emissiveIntensity={0.4}
          metalness={0.98}
          roughness={0.1}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
}

// Swirling Golden Embers & Dust Field
function GoldenEmbers({ count = 180 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sc = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16;
      sc[i] = Math.random() * 0.08 + 0.02;
    }
    return [pos, sc];
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.04;
    pointsRef.current.rotation.x += delta * 0.015;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#F3E5AB"
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Camera parallax mouse controller
function ParallaxRig() {
  const { camera, mouse } = useThree();
  useFrame(() => {
    camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.03;
    camera.position.y += (mouse.y * 0.5 + 0.5 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function RoyalAstScene({
  isSimulating = false,
}: RoyalAstSceneProps) {
  // Positions of nodes
  const producerPos: [number, number, number] = [-4.6, 0.4, 0];
  const consumerPos: [number, number, number] = [4.6, -0.4, 0];

  return (
    <div className="w-full h-full absolute inset-0 -z-10 pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0.5, 9.8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#070709"]} />

        {/* Ambient & Directional Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[6, 8, 5]} intensity={1.5} color="#FAF9F6" />
        <directionalLight position={[-6, -4, -3]} intensity={0.8} color="#996515" />
        <pointLight position={[0, 3, 2]} intensity={2.0} color="#D4AF37" distance={12} />

        {/* Parallax & Float Rig */}
        <ParallaxRig />

        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.6}>
          {/* Producer Node: API Vendor */}
          <ObsidianNode
            position={producerPos}
            role="producer"
          />

          {/* Consumer Node: Customer Repo */}
          <ObsidianNode
            position={consumerPos}
            role="consumer"
            isFractured={isSimulating}
            isHealed={!isSimulating}
          />

          {/* Golden Neural Kintsugi Bridge */}
          <GoldenNeuralBridge
            start={producerPos}
            end={consumerPos}
            isSimulating={isSimulating}
          />
        </Float>

        {/* Ambient Gold Embers */}
        <GoldenEmbers count={160} />

        {/* Postprocessing Bloom */}
        <EffectComposer multisampling={4}>
          <Bloom
            luminanceThreshold={0.3}
            luminanceSmoothing={0.85}
            intensity={1.2}
            mipmapBlur
          />
        </EffectComposer>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.7}
          minPolarAngle={Math.PI / 2.3}
          maxAzimuthAngle={Math.PI / 6}
          minAzimuthAngle={-Math.PI / 6}
        />
      </Canvas>
    </div>
  );
}
