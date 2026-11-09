"use client";

import dynamic from "next/dynamic";
import React from "react";

const RoyalAstScene = dynamic(() => import("./RoyalAstScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[#070709] flex items-center justify-center -z-10">
      <div className="relative flex items-center justify-center">
        <div className="w-48 h-48 rounded-full border border-[#D4AF37]/20 animate-spin" style={{ animationDuration: "12s" }} />
        <div className="absolute w-32 h-32 rounded-full border border-[#F3E5AB]/30 animate-spin" style={{ animationDuration: "8s", animationDirection: "reverse" }} />
        <div className="absolute w-3 h-3 rounded-full bg-[#D4AF37] shadow-[0_0_15px_#D4AF37] animate-ping" />
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
      <RoyalAstScene
        isSimulating={isSimulating}
        onSimulateComplete={onSimulateComplete}
      />
    </div>
  );
}

