"use client";

import React, { useState } from "react";
import RoyalAstCanvas from "@/components/canvas/RoyalAstCanvas";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import SplitScreenInteractiveDemo from "@/components/landing/SplitScreenInteractiveDemo";
import CitadelBentoGrid from "@/components/landing/CitadelBentoGrid";
import ArchitectureFlow from "@/components/landing/ArchitectureFlow";
import DualEngineSection from "@/components/landing/DualEngineSection";
import AuditStreamSection from "@/components/landing/AuditStreamSection";
import RoiCalculator from "@/components/landing/RoiCalculator";
import Footer from "@/components/landing/Footer";
import GitHubConnectionModal from "@/components/dashboard/GitHubConnectionModal";

export default function Home() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [githubModalOpen, setGithubModalOpen] = useState(false);

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
      <Navbar onOpenGitHubModal={() => setGithubModalOpen(true)} />

      {/* Hero Section */}
      <HeroSection
        isSimulating={isSimulating}
        onSimulateToggle={handleSimulateToggle}
        onOpenGitHubModal={() => setGithubModalOpen(true)}
      />

      {/* Split-Screen Interactive Demo */}
      <SplitScreenInteractiveDemo
        isSimulating={isSimulating}
        onSimulateToggle={handleSimulateToggle}
      />

      {/* Citadel Architecture Bento Grid */}
      <CitadelBentoGrid />

      {/* 5-Step Architecture Flow */}
      <ArchitectureFlow />

      {/* Dual Engine Perspective (Producer vs Consumer) */}
      <DualEngineSection />

      {/* Real-Time Protocol Telemetry Feed */}
      <AuditStreamSection />

      {/* Interactive ROI & Downtime Calculator */}
      <RoiCalculator />

      {/* Footer */}
      <Footer />

      {/* GitHub Connection Modal */}
      <GitHubConnectionModal
        isOpen={githubModalOpen}
        onClose={() => setGithubModalOpen(false)}
        installations={[]}
        onRefreshData={() => {}}
      />
    </main>
  );
}
