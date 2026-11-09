"use client";

import React, { useState } from "react";
import { UploadCloud, Shield, CheckCircle, BarChart3, Users, Zap, Terminal } from "lucide-react";
import Link from "next/link";

export default function DualEngineSection() {
  const [activeMode, setActiveMode] = useState<"producer" | "consumer">("consumer");

  return (
    <section id="dual-engine" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-[11px] font-mono tracking-widest uppercase text-[#D4AF37] mb-2 block">
          Dual-Sided Sovereign Network
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#FAF9F6] mb-4">
          One Platform. <span className="gold-text-gradient">Two Royal Perspectives.</span>
        </h2>
        <p className="text-sm sm:text-base text-[#A1A1AA]">
          Whether you publish APIs relied upon by millions or maintain mission-critical consumer codebases, Aurumend protects both sides of the contract.
        </p>

        {/* Toggle Mode */}
        <div className="inline-flex p-1 rounded-xl bg-[#111116] border border-[#D4AF37]/30 mt-8">
          <button
            onClick={() => setActiveMode("consumer")}
            className={`px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all ${
              activeMode === "consumer"
                ? "bg-gradient-to-r from-[#D4AF37] to-[#996515] text-[#070709] shadow-lg"
                : "text-[#A1A1AA] hover:text-[#FAF9F6]"
            }`}
          >
            Consumer Engineering View
          </button>
          <button
            onClick={() => setActiveMode("producer")}
            className={`px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all ${
              activeMode === "producer"
                ? "bg-gradient-to-r from-[#D4AF37] to-[#996515] text-[#070709] shadow-lg"
                : "text-[#A1A1AA] hover:text-[#FAF9F6]"
            }`}
          >
            API Vendor (Producer) View
          </button>
        </div>
      </div>

      {activeMode === "consumer" ? (
        <div className="rounded-3xl bg-[#111116]/80 backdrop-blur-xl border border-[#D4AF37]/30 p-8 sm:p-12 shadow-2xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono mb-4">
              <Shield className="w-3.5 h-3.5" />
              <span>Consumer Guardian Mode</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF9F6] mb-4">
              Zero-Downtime Immunity from Upstream Vendor Deprecations
            </h3>
            <p className="text-sm text-[#A1A1AA] leading-relaxed mb-6">
              Connect your GitHub Organization once. Aurumend continuously indexes your AST for Stripe, OpenAI, Twilio, and Resend integrations. When any vendor ships a breaking release, you receive a self-contained PR tested against a live sandbox before your legacy code is sunset.
            </p>

            <ul className="space-y-3 font-mono text-xs text-[#FAF9F6] mb-8">
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                <span>Just-In-Time short-lived GitHub tokens (No static secrets stored)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                <span>Exact AST call-site highlighting in files, controllers, and tests</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                <span>Deterministic mock contract verification in E2B microVM</span>
              </li>
            </ul>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#996515] text-[#070709] text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all shadow-lg"
            >
              <span>Explore Consumer Dashboard</span>
            </Link>
          </div>

          <div className="rounded-2xl bg-[#070709] border border-white/10 p-6 font-mono text-xs shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4 text-[#A1A1AA]">
              <span>aurumend-consumer-cli</span>
              <span className="text-emerald-400">● 4 Repos Active</span>
            </div>
            <div className="space-y-2">
              <div className="text-zinc-500">$ aurumend scan --repo acme/checkout-service</div>
              <div className="text-zinc-300">Indexed 142 source files using tree-sitter AST</div>
              <div className="text-[#D4AF37]">Found 4 External API Subscriptions:</div>
              <div className="pl-4 text-zinc-400 space-y-1">
                <div>• stripe (v2024-11) → 8 call sites</div>
                <div>• openai (v1.54) → 3 call sites</div>
                <div>• resend (v2.1) → 2 call sites</div>
              </div>
              <div className="text-emerald-400 pt-2">
                All subscriptions synced to Sovereign Bridge.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl bg-[#111116]/80 backdrop-blur-xl border border-[#D4AF37]/30 p-8 sm:p-12 shadow-2xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-mono mb-4">
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Vendor / Producer Hub</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF9F6] mb-4">
              Stop Losing Customers to Breaking Changes & Migration Fatigue
            </h3>
            <p className="text-sm text-[#A1A1AA] leading-relaxed mb-6">
              When releasing v2 or v3 of your API, do not force thousands of developers to decipher 40-page migration guides. Publish your new OpenAPI spec to Aurumend. We autonomously create and test pull requests in your customers&apos; repos, accelerating adoption 10x.
            </p>

            <ul className="space-y-3 font-mono text-xs text-[#FAF9F6] mb-8">
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                <span>Automated Migration Manifest generation powered by Claude Sonnet</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                <span>Real-time customer adoption telemetry & merge rate metrics</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                <span>CLI & GitHub Actions CI integration for automated release publishing</span>
              </li>
            </ul>

            <Link
              href="/dashboard/producer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#996515] text-[#070709] text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all shadow-lg"
            >
              <span>Explore Producer Portal</span>
            </Link>
          </div>

          <div className="rounded-2xl bg-[#070709] border border-white/10 p-6 font-mono text-xs shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4 text-[#A1A1AA]">
              <span>aurumend-producer-release.yml</span>
              <span className="text-[#D4AF37]">● CI/CD Publishing</span>
            </div>
            <div className="space-y-2">
              <div className="text-zinc-500">$ npx aurumend publish \</div>
              <div className="text-zinc-300 pl-4">--spec ./openapi/v2.json \</div>
              <div className="text-zinc-300 pl-4">--prev ./openapi/v1.json \</div>
              <div className="text-zinc-300 pl-4">--token $AURUMEND_API_KEY</div>
              <div className="text-[#D4AF37] pt-2">
                [AURUMEND] Analyzing spec differences...
              </div>
              <div className="text-zinc-400">
                12 endpoints modified, 2 parameters changed.
              </div>
              <div className="text-emerald-400">
                Dispatched self-healing workflows to 842 subscriber repositories.
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

