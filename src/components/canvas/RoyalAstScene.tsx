"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

interface RoyalAstSceneProps {
  isSimulating?: boolean;
}

// Glowing Twin Neural Conduits (Bezier Splines)
function GoldenDualBridge({
  start,
  end,
  isSimulating,
}: {
  start: [number, number, number];
  end: [number, number, number];
  isSimulating: boolean;
}) {
  const pulseRef1 = useRef<THREE.Mesh>(null);
  const pulseRef2 = useRef<THREE.Mesh>(null);
  const progress1 = useRef(0);
  const progress2 = useRef(0.5);

  const [curve1, curve2] = useMemo(() => {
    const vStart = new THREE.Vector3(...start);
    const vEnd = new THREE.Vector3(...end);

    // Spline 1 arches upward
    const mid1A = new THREE.Vector3(
      start[0] + (end[0] - start[0]) * 0.35,
      start[1] + 2.4,
      start[2] + 1.2
    );
    const mid1B = new THREE.Vector3(
      start[0] + (end[0] - start[0]) * 0.65,
      end[1] - 1.2,
      start[2] - 1.0
    );
    const c1 = new THREE.CubicBezierCurve3(vStart, mid1A, mid1B, vEnd);

    // Spline 2 arches downward/forward
    const mid2A = new THREE.Vector3(
      start[0] + (end[0] - start[0]) * 0.35,
      start[1] - 1.8,
      start[2] - 1.2
    );
    const mid2B = new THREE.Vector3(
      start[0] + (end[0] - start[0]) * 0.65,
      end[1] + 1.8,
      start[2] + 1.0
    );
    const c2 = new THREE.CubicBezierCurve3(vStart, mid2A, mid2B, vEnd);

    return [c1, c2];
  }, [start, end]);

  const tube1 = useMemo(() => new THREE.TubeGeometry(curve1, 80, 0.038, 12, false), [curve1]);
  const tube2 = useMemo(() => new THREE.TubeGeometry(curve2, 80, 0.028, 12, false), [curve2]);

  useFrame((_, delta) => {
    const speed = isSimulating ? 1.6 : 0.32;

    progress1.current = (progress1.current + delta * speed) % 1;
    progress2.current = (progress2.current + delta * (speed * 1.15)) % 1;

    if (pulseRef1.current) {
      pulseRef1.current.position.copy(curve1.getPoint(progress1.current));
    }
    if (pulseRef2.current) {
      pulseRef2.current.position.copy(curve2.getPoint(progress2.current));
    }
  });

  return (
    <group>
      {/* Primary Gold Conduit */}
      <mesh geometry={tube1}>
        <meshStandardMaterial
          color="#996515"
          emissive="#D4AF37"
          emissiveIntensity={isSimulating ? 1.2 : 0.5}
          metalness={0.97}
          roughness={0.12}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Secondary Resonant Conduit */}
      <mesh geometry={tube2}>
        <meshStandardMaterial
          color="#D4AF37"
          emissive="#F3E5AB"
          emissiveIntensity={isSimulating ? 0.9 : 0.35}
          metalness={0.98}
          roughness={0.14}
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* Pulsing Liquid Gold Beads */}
      <mesh ref={pulseRef1}>
        <sphereGeometry args={[0.15, 24, 24]} />
        <meshStandardMaterial
          color="#FAF9F6"
          emissive="#F3E5AB"
          emissiveIntensity={isSimulating ? 4.2 : 2.2}
          metalness={0.99}
          roughness={0.05}
        />
      </mesh>

      <mesh ref={pulseRef2}>
        <sphereGeometry args={[0.11, 20, 20]} />
        <meshStandardMaterial
          color="#D4AF37"
          emissive="#FAF9F6"
          emissiveIntensity={isSimulating ? 3.6 : 1.8}
          metalness={0.99}
          roughness={0.05}
        />
      </mesh>
    </group>
  );
}

// Royal Obsidian Monolith with Gyroscopic Gilded Rings
function ObsidianMonolith({
  position,
  scale = 1.0,
  role,
  isFractured,
  isHealed,
}: {
  position: [number, number, number];
  scale?: number;
  role: "producer" | "consumer" | "sentinel";
  isFractured?: boolean;
  isHealed?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.35;
      meshRef.current.rotation.x += delta * 0.18;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.65;
      ring1Ref.current.rotation.x += delta * 0.3;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.55;
      ring2Ref.current.rotation.z += delta * 0.25;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x += delta * 0.45;
      ring3Ref.current.rotation.y += delta * 0.35;
    }
  });

  const nodeColor = isFractured && !isHealed ? "#2c0e12" : "#0a0a0f";
  const emissiveColor = isFractured && !isHealed ? "#ef4444" : isHealed ? "#D4AF37" : "#996515";
  const emissiveIntensity = isFractured && !isHealed ? 1.0 : isHealed ? 1.8 : 0.35;

  return (
    <group position={position} scale={scale}>
      {/* Dark Obsidian Polyhedron Core */}
      <mesh ref={meshRef}>
        <octahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial
          color={nodeColor}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
          metalness={0.96}
          roughness={0.14}
        />
      </mesh>

      {/* Digital Kintsugi Wireframe Veins */}
      <mesh scale={1.03}>
        <octahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial
          wireframe
          color="#D4AF37"
          emissive="#F3E5AB"
          emissiveIntensity={isHealed ? 2.0 : 0.4}
          transparent
          opacity={isHealed ? 0.9 : 0.3}
        />
      </mesh>

      {/* Gyroscopic Ring 1 (Equatorial) */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.75, 0.024, 16, 64]} />
        <meshStandardMaterial
          color="#D4AF37"
          emissive="#996515"
          emissiveIntensity={0.6}
          metalness={0.98}
          roughness={0.08}
        />
      </mesh>

      {/* Gyroscopic Ring 2 (Polar 45 deg) */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.05, 0.018, 16, 64]} />
        <meshStandardMaterial
          color="#F3E5AB"
          emissive="#D4AF37"
          emissiveIntensity={0.5}
          metalness={0.98}
          roughness={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Gyroscopic Ring 3 (Outer Horizon) */}
      <mesh ref={ring3Ref} rotation={[0, Math.PI / 4, Math.PI / 3]}>
        <torusGeometry args={[2.35, 0.012, 16, 64]} />
        <meshStandardMaterial
          color="#996515"
          emissive="#F3E5AB"
          emissiveIntensity={0.3}
          metalness={0.98}
          roughness={0.12}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
}

// Floating Golden Pyramids / Shards in Deep Space
function FloatingGoldShards({ count = 18 }: { count?: number }) {
  const shards = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 10 - 2,
      ] as [number, number, number],
      scale: Math.random() * 0.25 + 0.12,
      rotationSpeed: Math.random() * 0.6 + 0.2,
    }));
  }, [count]);

  return (
    <group>
      {shards.map((s, idx) => (
        <Float key={idx} speed={1.2} rotationIntensity={0.5} floatIntensity={0.8}>
          <mesh position={s.position} scale={s.scale}>
            <tetrahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color="#D4AF37"
              emissive="#996515"
              emissiveIntensity={0.4}
              metalness={0.98}
              roughness={0.12}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// Golden Starfield / Embers Dust
function RoyalDustField({ count = 220 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 28;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    return [pos];
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.035;
    pointsRef.current.rotation.x += delta * 0.012;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#F3E5AB"
        size={0.055}
        sizeAttenuation
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Smooth Camera Parallax Controller
function ParallaxRig() {
  const { camera, mouse } = useThree();
  useFrame(() => {
    camera.position.x += (mouse.x * 0.7 - camera.position.x) * 0.025;
    camera.position.y += (mouse.y * 0.4 + 0.3 - camera.position.y) * 0.025;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function RoyalAstScene({
  isSimulating = false,
}: RoyalAstSceneProps) {
  const producerPos: [number, number, number] = [-4.8, 0.3, 0];
  const consumerPos: [number, number, number] = [4.8, -0.3, 0];
  const sentinelPos: [number, number, number] = [0, 2.6, -3];

  return (
    <div className="w-full h-full absolute inset-0 -z-10 pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0.4, 9.6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#070709"]} />

        {/* Ambient & Directional Royal Lighting */}
        <ambientLight intensity={0.45} />
        <directionalLight position={[7, 9, 6]} intensity={1.8} color="#FAF9F6" />
        <directionalLight position={[-7, -5, -4]} intensity={1.1} color="#996515" />
        <pointLight position={[0, 3, 2]} intensity={2.4} color="#D4AF37" distance={14} />

        <ParallaxRig />

        <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.5}>
          {/* Producer Monolith (Stripe/OpenAI) */}
          <ObsidianMonolith
            position={producerPos}
            role="producer"
            scale={1.05}
          />

          {/* Consumer Monolith (Customer Repositories) */}
          <ObsidianMonolith
            position={consumerPos}
            role="consumer"
            scale={1.05}
            isFractured={isSimulating}
            isHealed={!isSimulating}
          />

          {/* Sovereign Sentinel Monolith (Center Background Core) */}
          <ObsidianMonolith
            position={sentinelPos}
            role="sentinel"
            scale={0.7}
          />

          {/* Twin Pulsing Golden Neural Bridges */}
          <GoldenDualBridge
            start={producerPos}
            end={consumerPos}
            isSimulating={isSimulating}
          />
        </Float>

        {/* Floating Geometric Shards */}
        <FloatingGoldShards count={20} />

        {/* Golden Stardust Field */}
        <RoyalDustField count={220} />

        {/* Postprocessing Bloom */}
        <EffectComposer multisampling={4}>
          <Bloom
            luminanceThreshold={0.28}
            luminanceSmoothing={0.88}
            intensity={1.35}
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
