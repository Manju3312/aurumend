"use client";

import React, { useState } from "react";
import RoyalAstCanvas from "@/components/canvas/RoyalAstCanvas";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import SplitScreenInteractiveDemo from "@/components/landing/SplitScreenInteractiveDemo";
import ArchitectureFlow from "@/components/landing/ArchitectureFlow";
import DualEngineSection from "@/components/landing/DualEngineSection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulateToggle = () => {
    setIsSimulating((prev) => !prev);
  };

  return (
    <main className="relative min-h-screen bg-[#070709] text-[#FAF9F6] selection:bg-[#D4AF37]/30 selection:text-[#F3E5AB] overflow-x-hidden">
      {/* 3D Royal Kintsugi Canvas Background */}
      <RoyalAstCanvas isSimulating={isSimulating} />

      {/* Radial overlay to ensure crisp readability */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-radial from-transparent via-[#070709]/60 to-[#070709]"
        style={{ mixBlendMode: "multiply" }}
      />

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection
        isSimulating={isSimulating}
        onSimulateToggle={handleSimulateToggle}
      />

      {/* Split-Screen Interactive Demo */}
      <SplitScreenInteractiveDemo
        isSimulating={isSimulating}
        onSimulateToggle={handleSimulateToggle}
      />

      {/* 5-Step Architecture Flow */}
      <ArchitectureFlow />

      {/* Dual Engine Perspective (Producer vs Consumer) */}
      <DualEngineSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}

