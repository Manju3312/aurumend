"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface RoyalAstSceneProps {
  isSimulating?: boolean;
}

// Helical Double/Triple Strand of Particles with Gold & Black Nodes
function HelicalStrand({
  isSimulating,
}: {
  isSimulating?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Generate helical coordinates for both black and gold particle strands
  const { blackSpheres, goldSpheres, bridgeLines } = useMemo(() => {
    const turns = 4.2;
    const pointsPerTurn = 48;
    const totalPoints = Math.floor(turns * pointsPerTurn);
    const height = 9.5;
    const radius = 2.2;

    const bSpheres: [number, number, number][] = [];
    const gSpheres: [number, number, number][] = [];
    const bLines: [THREE.Vector3, THREE.Vector3][] = [];

    for (let i = 0; i < totalPoints; i++) {
      const t = i / totalPoints;
      const angle1 = t * Math.PI * 2 * turns;
      const angle2 = angle1 + Math.PI; // Opposite strand (180 deg phase)

      // Slight tapering at top and bottom for organic helix
      const rMod = radius * (0.85 + 0.3 * Math.sin(t * Math.PI));
      const y = (t - 0.5) * height;

      // Black strand
      const x1 = Math.cos(angle1) * rMod;
      const z1 = Math.sin(angle1) * rMod;
      bSpheres.push([x1, y, z1]);

      // Gold strand
      const x2 = Math.cos(angle2) * rMod;
      const z2 = Math.sin(angle2) * rMod;
      gSpheres.push([x2, y, z2]);

      // Every 3rd point, create a delicate bridging filament
      if (i % 3 === 0) {
        bLines.push([
          new THREE.Vector3(x1, y, z1),
          new THREE.Vector3(x2, y, z2),
        ]);
      }
    }

    return {
      blackSpheres: bSpheres,
      goldSpheres: gSpheres,
      bridgeLines: bLines,
    };
  }, []);

  // Geometry for bridging filaments
  const lineGeom = useMemo(() => {
    const positions: number[] = [];
    bridgeLines.forEach(([v1, v2]) => {
      positions.push(v1.x, v1.y, v1.z);
      positions.push(v2.x, v2.y, v2.z);
    });
    const geom = new THREE.BufferGeometry();
    geom.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    return geom;
  }, [bridgeLines]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const speed = isSimulating ? 1.4 : 0.45;
    // Rotation around Y axis
    groupRef.current.rotation.y += delta * speed;
    // Subtle breathing tilt
    groupRef.current.rotation.z = Math.sin(Date.now() * 0.001) * 0.08 - 0.15;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0.2, 0, -0.15]}>
      {/* Connecting Bridge Filaments */}
      <lineSegments geometry={lineGeom}>
        <lineBasicMaterial
          color="#BA8C28"
          transparent
          opacity={0.35}
          linewidth={1}
        />
      </lineSegments>

      {/* Black Particle Spheres */}
      {blackSpheres.map((pos, idx) => (
        <mesh key={`b-${idx}`} position={pos}>
          <sphereGeometry args={[0.075, 12, 12]} />
          <meshStandardMaterial
            color="#0A0A0A"
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      ))}

      {/* Gold Particle Spheres */}
      {goldSpheres.map((pos, idx) => (
        <mesh key={`g-${idx}`} position={pos}>
          <sphereGeometry args={[0.085, 12, 12]} />
          <meshStandardMaterial
            color="#BA8C28"
            emissive="#996515"
            emissiveIntensity={isSimulating ? 0.9 : 0.3}
            roughness={0.15}
            metalness={0.95}
          />
        </mesh>
      ))}
    </group>
  );
}

// Mouse Parallax Controller
function ParallaxRig() {
  const { camera, mouse } = useThree();
  useFrame(() => {
    camera.position.x += (mouse.x * 0.4 - camera.position.x) * 0.03;
    camera.position.y += (mouse.y * 0.3 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function RoyalAstScene({
  isSimulating = false,
}: RoyalAstSceneProps) {
  return (
    <div className="w-full h-full relative pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 11], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Soft lighting for light canvas */}
        <ambientLight intensity={1.4} />
        <directionalLight position={[6, 8, 6]} intensity={1.8} color="#FFFFFF" />
        <directionalLight position={[-6, -4, -4]} intensity={0.8} color="#F7EECD" />
        <pointLight position={[2, 2, 4]} intensity={1.5} color="#BA8C28" distance={12} />

        <ParallaxRig />

        <HelicalStrand isSimulating={isSimulating} />
      </Canvas>
    </div>
  );
}
