"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Terminal,
  Copy,
  Check,
  Zap,
  Code2,
  ExternalLink,
} from "lucide-react";
import RoyalAstCanvas from "@/components/canvas/RoyalAstCanvas";

interface HeroSectionProps {
  isSimulating: boolean;
  onSimulateToggle: () => void;
  onOpenGitHubModal?: () => void;
}

export default function HeroSection({
  isSimulating,
  onSimulateToggle,
  onOpenGitHubModal,
}: HeroSectionProps) {
  const [copiedCli, setCopiedCli] = useState(false);

  const handleCopyCli = () => {
    navigator.clipboard.writeText("npx aurumend scan --repo acme/payment-service");
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const handleSimulateWithBackend = async () => {
    onSimulateToggle();
    try {
      await fetch("/api/v1/webhooks/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendor_slug: "stripe",
          event_type: "payment_intent.succeeded",
        }),
      });
    } catch (err) {
      console.warn("Simulation trigger note:", err);
    }
  };

  return (
    <section className="relative pt-24 sm:pt-28 pb-16 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden">
      {/* Soft warm radial glow behind the hero and 3D spiral */}
      <div className="absolute top-1/3 right-10 w-[550px] h-[550px] bg-gradient-to-br from-[#F7EECD]/70 via-[#E8DEC8]/40 to-transparent rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Two-Column Grid matching reference image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
        {/* Left Column: Heading, Subhead, Action Buttons */}
        <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
          {/* Eyebrow Badge: ENTERPRISE SOVEREIGN DRIFT CONTAINMENT */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F3EC] border border-[#E5DAC1] shadow-xs mb-6 sm:mb-8">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.16em] uppercase text-[#8C6515]">
              ENTERPRISE SOVEREIGN DRIFT CONTAINMENT
            </span>
          </div>

          {/* Main Regal Headline: Black + Brass Gold */}
          <h1 className="font-sans font-black text-5xl sm:text-6xl md:text-7xl lg:text-[76px] tracking-tight leading-[0.96] text-[#0A0A0A] mb-6">
            A Shot of <br />
            Immunity <br />
            <span className="text-[#BA8C28]">Against Vendor</span> <br />
            <span className="text-[#BA8C28]">API Drift.</span>
          </h1>

          {/* Subheading from reference image */}
          <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed max-w-xl mb-8 font-normal">
            Watch fast-moving external APIs (Stripe, OpenAI, Webhooks). Contain
            damage in-process in &lt;2ms with zero body retention, and deliver
            tested, human-approved fix PRs.
          </p>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4">
            {/* Primary Black Button */}
            <button
              onClick={handleSimulateWithBackend}
              className="px-6 py-3.5 rounded-lg text-xs sm:text-sm font-bold tracking-wide text-[#FAF9F5] bg-[#0A0A0A] hover:bg-[#1C1C22] transition-all flex items-center gap-2 shadow-sm cursor-pointer group"
            >
              <span>{isSimulating ? "SIMULATION RUNNING..." : "LAUNCH SABOTAGE ARENA"}</span>
              <span className="text-[#BA8C28] group-hover:translate-x-0.5 transition-transform">
                →
              </span>
            </button>

            {/* Secondary White Button with Gold Border */}
            <Link
              href="#interactive-demo"
              className="px-6 py-3.5 rounded-lg text-xs sm:text-sm font-semibold tracking-wide text-[#0A0A0A] bg-white hover:bg-[#FAF9F5] border border-[#DFD2B5] transition-all flex items-center gap-2 shadow-xs"
            >
              <span>INSPECT TWO PATHS</span>
            </Link>
          </div>

          {/* Architecture Dossier Pill Link */}
          <div className="mb-8">
            <Link
              href="#architecture"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-transparent hover:bg-[#F5F3EC] border border-[#DFD2B5] text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C6515] transition-all"
            >
              <span>ARCHITECTURE DOSSIER</span>
              <ExternalLink className="w-3 h-3 text-[#BA8C28]" />
            </Link>
          </div>

          {/* Developer Quickstart CLI Box */}
          <div className="w-full max-w-xl flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-white border border-[#E5DAC1] shadow-xs">
            <div className="flex items-center gap-2 text-xs font-mono text-[#0A0A0A]">
              <Terminal className="w-3.5 h-3.5 text-[#BA8C28]" />
              <span className="text-[#8C6515] font-semibold">$</span>
              <span>npx aurumend scan --repo acme/payment-service</span>
            </div>
            <button
              onClick={handleCopyCli}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F5F3EC] hover:bg-[#EDE8DB] border border-[#DFD2B5] text-[11px] font-mono font-medium text-[#4B5563] transition-all cursor-pointer"
            >
              {copiedCli ? (
                <>
                  <Check className="w-3 h-3 text-[#10B981]" />
                  <span className="text-[#10B981] font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-[#71717A]" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Ecosystem integration badges */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-[#71717A]">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#8C6515]">
              Monitored Ecosystems:
            </span>
            <div className="flex items-center gap-3 font-semibold text-[#0A0A0A]">
              <span className="px-2 py-0.5 rounded bg-white border border-[#E5DAC1] text-[11px]">
                Stripe API
              </span>
              <span className="px-2 py-0.5 rounded bg-white border border-[#E5DAC1] text-[11px]">
                OpenAI SDK
              </span>
              <span className="px-2 py-0.5 rounded bg-white border border-[#E5DAC1] text-[11px]">
                Twilio
              </span>
              <span className="px-2 py-0.5 rounded bg-white border border-[#E5DAC1] text-[11px]">
                Resend
              </span>
              <span className="px-2 py-0.5 rounded bg-white border border-[#E5DAC1] text-[11px]">
                Plaid
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Helical Particle Spiral Canvas */}
        <div className="lg:col-span-5 relative w-full flex items-center justify-center">
          <RoyalAstCanvas isSimulating={isSimulating} />
        </div>
      </div>
    </section>
  );
}
