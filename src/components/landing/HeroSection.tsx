"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Github,
  Play,
  RotateCw,
  CheckCircle2,
  Cpu,
  Layers,
  Terminal,
} from "lucide-react";

interface HeroSectionProps {
  isSimulating: boolean;
  onSimulateToggle: () => void;
}

export default function HeroSection({
  isSimulating,
  onSimulateToggle,
}: HeroSectionProps) {
  const [activeStep, setActiveStep] = useState(0);

  const simulationSteps = [
    { title: "OASDiff Ingestion", desc: "Detected POST /v1/charges removed in Stripe v2025-04", icon: "01" },
    { title: "AST Call-Graph Scan", desc: "@ast-grep found 3 call-sites in src/services/payment.ts", icon: "02" },
    { title: "Claude Refactoring Agent", desc: "Synthesizing PaymentIntents wrapper with automatic confirmation", icon: "03" },
    { title: "E2B MicroVM Sandbox", desc: "Stoplight Prism mock server verified all contracts (Exit Code 0)", icon: "04" },
    { title: "Verified PR Delivered", desc: "Branch aurumend/migrate-stripe-v2025-04 ready for 1-click merge", icon: "05" },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSimulating) {
      setActiveStep(0);
      interval = setInterval(() => {
        setActiveStep((prev) => (prev < simulationSteps.length - 1 ? prev + 1 : 0));
      }, 1200);
    } else {
      setActiveStep(0);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

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
      console.warn("Hero simulation trigger note:", err);
    }
  };

  return (
    <section className="relative pt-36 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#D4AF37]/15 via-[#F3E5AB]/10 to-transparent rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Sovereign Protocol Badge */}
      <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#111116]/90 border border-[#D4AF37]/35 backdrop-blur-xl mb-8 shadow-[0_0_25px_rgba(212,175,55,0.2)]">
        <Sparkles className="w-3.5 h-3.5 text-[#F3E5AB]" />
        <span className="text-[11px] font-mono tracking-widest uppercase text-[#FAF9F6]">
          The Sovereign Protocol for Self-Healing APIs
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
      </div>

      {/* Hero Title */}
      <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#FAF9F6] max-w-5xl leading-[1.06] mb-6">
        When External APIs Break,{" "}
        <span className="gold-text-gradient block mt-2">
          Aurumend Heals Your Codebase.
        </span>
      </h1>

      {/* Subtitle */}
      <p className="max-w-2xl text-base sm:text-lg text-[#A1A1AA] leading-relaxed mb-10 font-sans">
        The autonomous bridge between <strong className="text-[#FAF9F6]">API Producers</strong> and <strong className="text-[#FAF9F6]">Customer Repositories</strong>. We ingest changelogs, trace your exact AST call-sites, and deliver contract-verified Pull Requests before sunset deadlines hit.
      </p>

      {/* Interactive Action Controls */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
        <button
          onClick={handleSimulateWithBackend}
          className={`relative group px-7 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer shadow-xl ${
            isSimulating
              ? "bg-[#D4AF37]/25 border border-[#D4AF37] text-[#F3E5AB] shadow-[0_0_35px_rgba(212,175,55,0.45)]"
              : "bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#996515] text-[#070709] hover:shadow-[0_0_35px_rgba(212,175,55,0.4)] hover:brightness-110"
          }`}
        >
          {isSimulating ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin text-[#F3E5AB]" />
              <span>Simulating Neural Healing...</span>
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
          className="px-6 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-[#FAF9F6] bg-[#111116]/90 hover:bg-[#181824] border border-[#D4AF37]/30 hover:border-[#D4AF37]/70 transition-all flex items-center gap-2 shadow-lg"
        >
          <Github className="w-4 h-4 text-[#D4AF37]" />
          <span>Launch Control Plane</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#A1A1AA]" />
        </Link>
      </div>

      {/* Live Simulation Stepper (Activated during simulation) */}
      {isSimulating && (
        <div className="w-full max-w-4xl mb-14 p-5 rounded-2xl bg-[#111116]/90 backdrop-blur-2xl border border-[#D4AF37]/40 shadow-2xl animate-fade-in text-left">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-ping" />
              <span className="font-bold text-[#F3E5AB] uppercase tracking-wider">
                Autonomous Pipeline Execution in Progress
              </span>
            </div>
            <span className="text-[#A1A1AA]">Stage {activeStep + 1} of 5</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
            {simulationSteps.map((s, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition-all text-xs font-mono ${
                  idx === activeStep
                    ? "bg-[#D4AF37]/15 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.25)]"
                    : idx < activeStep
                    ? "bg-black/50 border-emerald-500/40 text-emerald-400"
                    : "bg-black/30 border-white/5 text-zinc-600"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 font-bold">
                  <span>{s.icon}</span>
                  {idx < activeStep ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : idx === activeStep ? (
                    <RotateCw className="w-3.5 h-3.5 animate-spin text-[#F3E5AB]" />
                  ) : null}
                </div>
                <div className={`font-semibold mb-1 ${idx === activeStep ? "text-[#FAF9F6]" : ""}`}>
                  {s.title}
                </div>
                <div className="text-[10px] text-[#A1A1AA] line-clamp-2 leading-tight">
                  {s.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
        <div className="p-4 rounded-xl bg-[#111116]/80 backdrop-blur-md border border-[#D4AF37]/20 text-left hover:border-[#D4AF37]/45 transition-colors">
          <div className="text-2xl font-serif font-bold text-[#F3E5AB]">0 Min</div>
          <div className="text-[11px] text-[#A1A1AA] uppercase tracking-wider mt-0.5">
            Downtime on Breaking API Upgrades
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111116]/80 backdrop-blur-md border border-[#D4AF37]/20 text-left hover:border-[#D4AF37]/45 transition-colors">
          <div className="text-2xl font-serif font-bold text-[#D4AF37]">100%</div>
          <div className="text-[11px] text-[#A1A1AA] uppercase tracking-wider mt-0.5">
            Rust AST-Grep Syntax Precision
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111116]/80 backdrop-blur-md border border-[#D4AF37]/20 text-left hover:border-[#D4AF37]/45 transition-colors">
          <div className="text-2xl font-serif font-bold text-[#F3E5AB]">E2B MicroVM</div>
          <div className="text-[11px] text-[#A1A1AA] uppercase tracking-wider mt-0.5">
            Isolated Prism Mock Contract Tests
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111116]/80 backdrop-blur-md border border-[#D4AF37]/20 text-left hover:border-[#D4AF37]/45 transition-colors">
          <div className="text-2xl font-serif font-bold text-[#D4AF37]">Zero</div>
          <div className="text-[11px] text-[#A1A1AA] uppercase tracking-wider mt-0.5">
            Mock Placeholders or Hallucinations
          </div>
        </div>
      </div>
    </section>
  );
}
