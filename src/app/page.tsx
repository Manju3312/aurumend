"use client";

import React, { useState } from "react";
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
    <main className="relative min-h-screen bg-[#FAF9F5] text-[#0A0A0A] selection:bg-[#BA8C28]/25 selection:text-[#0A0A0A] overflow-x-hidden">
      {/* Navigation matching reference design */}
      <Navbar onOpenGitHubModal={() => setGithubModalOpen(true)} />

      {/* Hero Section with 2-Column Split + 3D Helix from reference design */}
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
