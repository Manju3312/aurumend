"use client";

import dynamic from "next/dynamic";
import React from "react";
import { Activity } from "lucide-react";

const RoyalAstScene = dynamic(() => import("./RoyalAstScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-48 h-48 rounded-full border border-[#BA8C28]/20 animate-spin" />
    </div>
  ),
});

interface RoyalAstCanvasProps {
  isSimulating?: boolean;
}

export default function RoyalAstCanvas({
  isSimulating = false,
}: RoyalAstCanvasProps) {
  return (
    <div className="relative w-full h-[520px] lg:h-[620px] flex items-center justify-center">
      {/* 3D Helical Particle Spiral Canvas */}
      <RoyalAstScene isSimulating={isSimulating} />

      {/* Floating Telemetry Badge from Reference Image: FAIL-OPEN CIRCUIT BREAKER ACTIVE */}
      <div className="absolute bottom-6 right-4 sm:right-10 z-20 pointer-events-none">
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/95 backdrop-blur-md border border-[#E5DAC1] shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
          <Activity className="w-3.5 h-3.5 text-[#BA8C28] stroke-[2.5]" />
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#0A0A0A]">
              FAIL-OPEN CIRCUIT BREAKER
            </span>
            <span className="text-[9px] font-mono tracking-widest text-[#BA8C28] uppercase font-semibold">
              ACTIVE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
