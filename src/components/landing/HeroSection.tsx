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
  Terminal,
  Copy,
  Check,
  Clock,
  Code2,
} from "lucide-react";

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
  const [activeStep, setActiveStep] = useState(0);
  const [copiedCli, setCopiedCli] = useState(false);

  const simulationSteps = [
    {
      title: "1. OASDiff Spec Ingestion",
      desc: "Detected POST /v1/charges removed in Stripe v2025-04",
      timing: "140ms",
    },
    {
      title: "2. Tree-Sitter AST Scan",
      desc: "@ast-grep pinpointed 3 call-sites in src/services/payment.ts",
      timing: "24ms",
    },
    {
      title: "3. Claude 3.7 Code Transform",
      desc: "Synthesized PaymentIntents client wrapper with type inference",
      timing: "1.2s",
    },
    {
      title: "4. E2B Sandbox Verification",
      desc: "Stoplight Prism mock server verified 100% contract compliance",
      timing: "2.4s",
    },
    {
      title: "5. Verified PR Delivered",
      desc: "PR #426 opened via JIT token; ready for 1-click merge",
      timing: "480ms",
    },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSimulating) {
      setActiveStep(0);
      interval = setInterval(() => {
        setActiveStep((prev) => (prev < simulationSteps.length - 1 ? prev + 1 : 0));
      }, 1300);
    } else {
      setActiveStep(0);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

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
    <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-gradient-to-tr from-amber-500/10 via-amber-200/5 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Product Changelog / Announcement Pill */}
      <Link
        href="#interactive-demo"
        className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-amber-400/40 backdrop-blur-xl mb-8 transition-all group shadow-sm"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-medium text-[#FAF9F6]">
          Stripe v2025-04 & OpenAI v2 migration recipes active
        </span>
        <span className="text-xs text-[#A1A1AA] group-hover:text-[#FAF9F6] flex items-center gap-0.5">
          <span>See live PR</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </Link>

      {/* Hero Headline (Modern, developer-focused, human-designed) */}
      <h1 className="font-sans text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#FAF9F6] max-w-5xl leading-[1.08] mb-6">
        Never break on an upstream{" "}
        <span className="bg-gradient-to-r from-[#FAF9F6] via-[#F3E5AB] to-[#D4AF37] bg-clip-text text-transparent block sm:inline">
          API change again.
        </span>
      </h1>

      {/* Subtitle */}
      <p className="max-w-2xl text-base sm:text-lg text-[#A1A1AA] leading-relaxed mb-8 font-sans">
        Aurumend continuously tracks breaking releases from the APIs you rely on, traces every impacted call-site across your AST, and opens contract-verified Pull Requests before sunset deadlines hit production.
      </p>

      {/* Interactive CLI command copy bar */}
      <div className="flex items-center gap-3 p-1.5 pl-4 pr-2 rounded-xl bg-[#0e0e13] border border-white/[0.08] shadow-lg mb-10 max-w-md w-full justify-between font-mono text-xs text-zinc-300">
        <div className="flex items-center gap-2 truncate">
          <span className="text-amber-400 select-none">$</span>
          <span className="text-[#FAF9F6] truncate">npx aurumend scan --repo acme/payments</span>
        </div>
        <button
          onClick={handleCopyCli}
          className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0 flex items-center gap-1 text-[11px]"
          title="Copy to clipboard"
        >
          {copiedCli ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-sans">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="font-sans">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Action Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3.5 mb-14">
        {onOpenGitHubModal ? (
          <button
            onClick={onOpenGitHubModal}
            className="px-6 py-3 rounded-xl text-xs font-semibold tracking-tight uppercase text-[#070709] bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#c29828] hover:brightness-110 shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all flex items-center gap-2 cursor-pointer"
          >
            <Github className="w-4 h-4 text-[#070709]" />
            <span>Connect GitHub Repository</span>
          </button>
        ) : (
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-xl text-xs font-semibold tracking-tight uppercase text-[#070709] bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#c29828] hover:brightness-110 shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all flex items-center gap-2 cursor-pointer"
          >
            <Github className="w-4 h-4 text-[#070709]" />
            <span>Connect GitHub Repository</span>
          </Link>
        )}

        <button
          onClick={handleSimulateWithBackend}
          className={`px-5 py-3 rounded-xl text-xs font-medium tracking-tight text-[#FAF9F6] border transition-all cursor-pointer flex items-center gap-2 ${
            isSimulating
              ? "bg-amber-500/15 border-amber-400 text-amber-200 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
              : "bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] hover:border-white/20"
          }`}
        >
          {isSimulating ? (
            <>
              <RotateCw className="w-3.5 h-3.5 animate-spin text-amber-300" />
              <span>Simulating Pipeline...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span>Simulate Breaking Release</span>
            </>
          )}
        </button>
      </div>

      {/* Live Simulation Stepper Runner (Active when simulating) */}
      {isSimulating && (
        <div className="w-full max-w-4xl mb-14 p-5 rounded-2xl bg-[#0d0d12] border border-amber-500/30 shadow-2xl animate-fade-in text-left">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="font-semibold text-[#FAF9F6]">
                Autonomous Pipeline Execution
              </span>
              <span className="text-zinc-500">•</span>
              <span className="text-amber-300 font-mono">acme-corp/payment-service</span>
            </div>
            <span className="text-[#A1A1AA]">Stage {activeStep + 1} of 5</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
            {simulationSteps.map((s, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition-all text-xs font-mono ${
                  idx === activeStep
                    ? "bg-amber-500/10 border-amber-500/40 text-amber-200 shadow-sm"
                    : idx < activeStep
                    ? "bg-black/50 border-emerald-500/30 text-emerald-400"
                    : "bg-black/30 border-white/[0.04] text-zinc-600"
                }`}
              >
                <div className="flex items-center justify-between mb-1 font-bold">
                  <span className="text-[10px] text-zinc-500">{s.timing}</span>
                  {idx < activeStep ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : idx === activeStep ? (
                    <RotateCw className="w-3.5 h-3.5 animate-spin text-amber-300" />
                  ) : null}
                </div>
                <div className={`font-semibold mb-1 text-[11px] ${idx === activeStep ? "text-[#FAF9F6]" : ""}`}>
                  {s.title}
                </div>
                <div className="text-[10px] text-zinc-400 line-clamp-2 leading-tight">
                  {s.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ecosystem / Supported APIs Bar */}
      <div className="w-full max-w-4xl pt-6 pb-6 border-y border-white/[0.06] mb-12">
        <div className="text-xs font-medium uppercase tracking-wider text-[#A1A1AA] mb-4">
          Autonomous deprecation scanning & migration recipes for
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 text-xs font-mono text-zinc-400">
          <span className="hover:text-white transition-colors flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" /> Stripe API
          </span>
          <span className="hover:text-white transition-colors flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> OpenAI SDK
          </span>
          <span className="hover:text-white transition-colors flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> Twilio Voice & SMS
          </span>
          <span className="hover:text-white transition-colors flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white" /> Resend Email
          </span>
          <span className="hover:text-white transition-colors flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" /> Plaid Banking
          </span>
          <span className="hover:text-white transition-colors flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> AWS SDK v3
          </span>
        </div>
      </div>

      {/* Real Developer Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl text-left">
        <div className="p-4 rounded-xl dev-card">
          <div className="text-2xl font-bold font-sans text-[#FAF9F6]">0 Min</div>
          <div className="text-xs text-[#A1A1AA] mt-1">Downtime during API deprecations</div>
        </div>
        <div className="p-4 rounded-xl dev-card">
          <div className="text-2xl font-bold font-sans text-emerald-400">100%</div>
          <div className="text-xs text-[#A1A1AA] mt-1">Mock-verified Prism contract tests</div>
        </div>
        <div className="p-4 rounded-xl dev-card">
          <div className="text-2xl font-bold font-sans text-[#F3E5AB]">3.2ms</div>
          <div className="text-xs text-[#A1A1AA] mt-1">Rust Tree-sitter AST scan speed</div>
        </div>
        <div className="p-4 rounded-xl dev-card">
          <div className="text-2xl font-bold font-sans text-[#FAF9F6]">1-Click</div>
          <div className="text-xs text-[#A1A1AA] mt-1">Merge via ephemeral JIT GitHub tokens</div>
        </div>
      </div>
    </section>
  );
}
