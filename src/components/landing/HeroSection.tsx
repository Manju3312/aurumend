"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Github,
  Zap,
  Play,
  RotateCw,
  Layers,
  Cpu,
} from "lucide-react";

interface HeroSectionProps {
  isSimulating: boolean;
  onSimulateToggle: () => void;
}

export default function HeroSection({
  isSimulating,
  onSimulateToggle,
}: HeroSectionProps) {
  return (
    <section className="relative pt-36 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
      {/* Sovereign Protocol Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111116]/90 border border-[#D4AF37]/30 backdrop-blur-xl mb-8 shadow-[0_0_20px_rgba(212,175,55,0.15)] animate-fade-in">
        <Sparkles className="w-3.5 h-3.5 text-[#F3E5AB]" />
        <span className="text-[11px] font-mono tracking-widest uppercase text-[#FAF9F6]">
          The Sovereign Protocol for Self-Healing APIs
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
      </div>

      {/* Hero Title */}
      <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#FAF9F6] max-w-5xl leading-[1.08] mb-6">
        When External APIs Break,{" "}
        <span className="gold-text-gradient block mt-1">
          Aurumend Heals Your Codebase.
        </span>
      </h1>

      {/* Subtitle */}
      <p className="max-w-2xl text-base sm:text-lg text-[#A1A1AA] leading-relaxed mb-10 font-sans">
        The autonomous bridge between <strong className="text-[#FAF9F6]">API Producers</strong> and <strong className="text-[#FAF9F6]">Customer Repositories</strong>. We ingest changelogs, trace your exact AST call-sites, and deliver contract-verified Pull Requests before sunset deadlines hit.
      </p>

      {/* Interactive CTA Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
        <button
          onClick={onSimulateToggle}
          className={`relative group px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer ${
            isSimulating
              ? "bg-[#D4AF37]/20 border border-[#D4AF37] text-[#F3E5AB] shadow-[0_0_30px_rgba(212,175,55,0.4)]"
              : "bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#996515] text-[#070709] hover:shadow-[0_0_30px_rgba(212,175,55,0.35)]"
          }`}
        >
          {isSimulating ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin text-[#F3E5AB]" />
              <span>Simulating Breaking Change...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Simulate Breaking Change</span>
            </>
          )}
        </button>

        <Link
          href="/dashboard"
          className="px-6 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-[#FAF9F6] bg-[#111116]/80 hover:bg-[#161622] border border-[#D4AF37]/30 hover:border-[#D4AF37]/70 transition-all flex items-center gap-2 shadow-lg"
        >
          <Github className="w-4 h-4 text-[#D4AF37]" />
          <span>Install GitHub App</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#A1A1AA]" />
        </Link>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
        <div className="p-4 rounded-xl bg-[#111116]/80 backdrop-blur-md border border-[#D4AF37]/20 text-left">
          <div className="text-2xl font-serif font-bold text-[#F3E5AB]">0 Min</div>
          <div className="text-[11px] text-[#A1A1AA] uppercase tracking-wider mt-0.5">
            Downtime on Breaking API Upgrades
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111116]/80 backdrop-blur-md border border-[#D4AF37]/20 text-left">
          <div className="text-2xl font-serif font-bold text-[#D4AF37]">100%</div>
          <div className="text-[11px] text-[#A1A1AA] uppercase tracking-wider mt-0.5">
            Rust AST-Grep Syntax Precision
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111116]/80 backdrop-blur-md border border-[#D4AF37]/20 text-left">
          <div className="text-2xl font-serif font-bold text-[#F3E5AB]">E2B MicroVM</div>
          <div className="text-[11px] text-[#A1A1AA] uppercase tracking-wider mt-0.5">
            Isolated Prism Mock Contract Tests
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111116]/80 backdrop-blur-md border border-[#D4AF37]/20 text-left">
          <div className="text-2xl font-serif font-bold text-[#D4AF37]">Zero</div>
          <div className="text-[11px] text-[#A1A1AA] uppercase tracking-wider mt-0.5">
            Mock Placeholders or Hallucinations
          </div>
        </div>
      </div>
    </section>
  );
}

