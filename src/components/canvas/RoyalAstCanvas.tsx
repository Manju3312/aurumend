"use client";

import dynamic from "next/dynamic";
import React from "react";
import { ShieldCheck, Activity, Cpu } from "lucide-react";

const RoyalAstScene = dynamic(() => import("./RoyalAstScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[#070709] flex items-center justify-center -z-10">
      <div className="relative flex items-center justify-center">
        <div
          className="w-56 h-56 rounded-full border border-[#D4AF37]/20 animate-spin"
          style={{ animationDuration: "14s" }}
        />
        <div
          className="absolute w-40 h-40 rounded-full border border-[#F3E5AB]/30 animate-spin"
          style={{ animationDuration: "9s", animationDirection: "reverse" }}
        />
        <div className="absolute w-3 h-3 rounded-full bg-[#D4AF37] shadow-[0_0_20px_#D4AF37] animate-ping" />
      </div>
    </div>
  ),
});

interface RoyalAstCanvasProps {
  isSimulating?: boolean;
  onSimulateComplete?: () => void;
}

export default function RoyalAstCanvas({
  isSimulating = false,
  onSimulateComplete,
}: RoyalAstCanvasProps) {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-auto">
      {/* 3D WebGL Canvas */}
      <RoyalAstScene isSimulating={isSimulating} />

      {/* Floating 2D Royal Telemetry HUD Overlays (Pointer-events none) */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 sm:p-10 select-none z-0">
        <div className="flex items-center justify-between">
          {/* Producer Node Live Telemetry */}
          <div className="hidden lg:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#111116]/80 backdrop-blur-md border border-[#D4AF37]/30 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#FAF9F6]">
              PRODUCER: STRIPE v2025-04 • EMITTING CONTRACT
            </span>
          </div>

          {/* Consumer Node Live Telemetry */}
          <div className="hidden lg:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#111116]/80 backdrop-blur-md border border-emerald-500/30 shadow-lg">
            <span
              className={`w-2 h-2 rounded-full ${
                isSimulating ? "bg-rose-500 animate-ping" : "bg-emerald-400"
              }`}
            />
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#FAF9F6]">
              {isSimulating
                ? "CONSUMER: REFACTORING & SANDBOX TESTING..."
                : "CONSUMER: PAYMENT-SVC • SHIELD: 100% IMMUNE"}
            </span>
          </div>
        </div>

        {/* Center Conduit Telemetry Badge */}
        <div className="flex justify-center pb-8">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#111116]/85 backdrop-blur-xl border border-[#D4AF37]/25 shadow-2xl">
            <Cpu className="w-3.5 h-3.5 text-[#F3E5AB]" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#A1A1AA]">
              SOVEREIGN NEURAL BRIDGE:{" "}
              <strong className="text-[#F3E5AB]">
                {isSimulating ? "HEALING BREAKING CALL-SITES" : "ACTIVE • ZERO HALLUCINATIONS"}
              </strong>
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-black/60 text-[#D4AF37] border border-[#D4AF37]/20">
              4.2ms Latency
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
