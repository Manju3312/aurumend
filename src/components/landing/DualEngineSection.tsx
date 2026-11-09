"use client";

import React, { useState } from "react";
import { Shield, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DualEngineSection() {
  const [activeMode, setActiveMode] = useState<"consumer" | "producer">("consumer");

  return (
    <section id="dual-engine" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F3EC] border border-[#E5DAC1] shadow-xs mb-3">
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C6515] font-bold">
            Built for Both Sides
          </span>
        </div>
        <h2 className="font-sans text-3xl sm:text-5xl font-black tracking-tight text-[#0A0A0A] mb-4">
          One platform. <span className="text-[#BA8C28]">Two perspectives.</span>
        </h2>
        <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed">
          Whether you consume external APIs in mission-critical applications or publish an API depended on by thousands of developers, Aurumend protects both sides of the contract.
        </p>

        {/* Toggle Mode */}
        <div className="inline-flex p-1 rounded-xl bg-white border border-[#E5DAC1] mt-8 shadow-xs">
          <button
            onClick={() => setActiveMode("consumer")}
            className={`px-5 py-2.5 rounded-lg text-xs font-semibold tracking-tight transition-all cursor-pointer ${
              activeMode === "consumer"
                ? "bg-[#0A0A0A] text-[#FAF9F5] shadow-xs"
                : "text-[#4B5563] hover:text-[#0A0A0A]"
            }`}
          >
            For Engineering Teams (Consumers)
          </button>
          <button
            onClick={() => setActiveMode("producer")}
            className={`px-5 py-2.5 rounded-lg text-xs font-semibold tracking-tight transition-all cursor-pointer ${
              activeMode === "producer"
                ? "bg-[#0A0A0A] text-[#FAF9F5] shadow-xs"
                : "text-[#4B5563] hover:text-[#0A0A0A]"
            }`}
          >
            For API Vendors (Producers)
          </button>
        </div>
      </div>

      {activeMode === "consumer" ? (
        <div className="rounded-2xl bg-white border border-[#E5DAC1] p-8 sm:p-12 shadow-xs grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-semibold mb-4">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Consumer Guardian Mode</span>
            </div>
            <h3 className="font-sans text-2xl sm:text-3xl font-black text-[#0A0A0A] mb-4">
              Zero downtime from third-party API deprecations
            </h3>
            <p className="text-sm text-[#4B5563] leading-relaxed mb-6 font-sans">
              Connect your GitHub Organization once. Aurumend continuously indexes your AST for third-party integrations (Stripe, OpenAI, Twilio, Resend). When any vendor ships a breaking version, you receive a ready-to-merge PR verified against an isolated mock server before legacy endpoints are decommissioned.
            </p>

            <ul className="space-y-3 font-mono text-xs text-[#0A0A0A] mb-8 font-medium">
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Short-lived JIT GitHub App tokens (no static credentials stored)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Exact AST call-site mapping in source files, controllers, and tests</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Isolated mock contract verification in an E2B microVM</span>
              </li>
            </ul>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0A0A0A] hover:bg-[#1C1C22] text-[#FAF9F5] text-xs font-bold tracking-wide transition-all shadow-xs cursor-pointer"
            >
              <span>Explore Consumer Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#BA8C28]" />
            </Link>
          </div>

          <div className="rounded-xl bg-[#0D0D11] border border-[#E5DAC1]/50 p-5 font-mono text-xs shadow-xs text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4 text-zinc-400">
              <span>aurumend-consumer-cli</span>
              <span className="text-emerald-400 font-semibold">● 4 Repos Active</span>
            </div>
            <div className="space-y-2 text-[11px]">
              <div className="text-zinc-500">$ npx aurumend scan --repo acme/payment-service</div>
              <div className="text-zinc-300">✓ Scanning 38 repository files with @ast-grep Tree-sitter</div>
              <div className="text-[#F3E5AB]">
                Found 6 active API call-sites:
              </div>
              <div className="pl-4 space-y-1 text-zinc-400">
                <div>• Stripe SDK: 4 sites (src/services/payment.ts:4, 10)</div>
                <div>• OpenAI Client: 2 sites (src/services/ai-assistant.ts:4, 7)</div>
              </div>
              <div className="text-emerald-400 pt-2 font-semibold">
                ✓ Continuous contract tracking active. 0 vulnerable call-sites.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-[#E5DAC1] p-8 sm:p-12 shadow-xs grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F3EC] border border-[#E5DAC1] text-[#8C6515] text-xs font-mono font-semibold mb-4">
              <Shield className="w-3.5 h-3.5 text-[#BA8C28]" />
              <span>Vendor Sovereign Publisher</span>
            </div>
            <h3 className="font-sans text-2xl sm:text-3xl font-black text-[#0A0A0A] mb-4">
              Ship breaking versions without stranding developers
            </h3>
            <p className="text-sm text-[#4B5563] leading-relaxed mb-6 font-sans">
              Publishing a major API revision often triggers years of migration lag and support tickets. With Aurumend, upload your new OpenAPI spec to automatically generate migration manifests, notify consumer repositories, and distribute auto-tested PRs directly to your customers.
            </p>

            <ul className="space-y-3 font-mono text-xs text-[#0A0A0A] mb-8 font-medium">
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>OASDiff schema diffing generates migration manifests automatically</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Track downstream customer repo adoption in real time</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cryptographically signed releases with SHA-256 API keys</span>
              </li>
            </ul>

            <Link
              href="/dashboard/producer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0A0A0A] hover:bg-[#1C1C22] text-[#FAF9F5] text-xs font-bold tracking-wide transition-all shadow-xs cursor-pointer"
            >
              <span>Explore Producer Studio</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#BA8C28]" />
            </Link>
          </div>

          <div className="rounded-xl bg-[#0D0D11] border border-[#E5DAC1]/50 p-5 font-mono text-xs shadow-xs text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4 text-zinc-400">
              <span>aurumend-publisher-cli</span>
              <span className="text-[#BA8C28] font-semibold">● v2025-04 Staged</span>
            </div>
            <div className="space-y-2 text-[11px]">
              <div className="text-zinc-500">$ aurumend publish --spec ./openapi-v2025-04.json</div>
              <div className="text-zinc-300">✓ Ingested OpenAPI 3.0 specification (42 endpoints)</div>
              <div className="text-[#F3E5AB]">
                OASDiff identified 1 breaking change:
              </div>
              <div className="pl-4 space-y-1 text-zinc-400">
                <div>- POST /v1/charges removed</div>
                <div>+ POST /v1/payment_intents required</div>
              </div>
              <div className="text-emerald-400 pt-2 font-semibold">
                ✓ Migration manifest generated. Downstream consumers notified.
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
