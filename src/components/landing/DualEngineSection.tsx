"use client";

import React, { useState } from "react";
import { UploadCloud, Shield, CheckCircle, BarChart3, Users, Zap, Terminal, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DualEngineSection() {
  const [activeMode, setActiveMode] = useState<"consumer" | "producer">("consumer");

  return (
    <section id="dual-engine" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="text-xs font-mono uppercase text-[#A1A1AA]">
            Built for Both Sides
          </span>
        </div>
        <h2 className="font-sans text-3xl sm:text-5xl font-bold tracking-tight text-[#FAF9F6] mb-4">
          One platform. <span className="text-amber-300">Two perspectives.</span>
        </h2>
        <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed">
          Whether you consume external APIs in mission-critical applications or publish an API depended on by thousands of developers, Aurumend protects both sides of the contract.
        </p>

        {/* Toggle Mode */}
        <div className="inline-flex p-1 rounded-xl bg-[#0f0f15] border border-white/[0.08] mt-8 shadow-sm">
          <button
            onClick={() => setActiveMode("consumer")}
            className={`px-5 py-2.5 rounded-lg text-xs font-medium tracking-tight transition-all cursor-pointer ${
              activeMode === "consumer"
                ? "bg-white/[0.1] text-white font-semibold border border-white/[0.12] shadow-sm"
                : "text-[#A1A1AA] hover:text-[#FAF9F6]"
            }`}
          >
            For Engineering Teams (Consumers)
          </button>
          <button
            onClick={() => setActiveMode("producer")}
            className={`px-5 py-2.5 rounded-lg text-xs font-medium tracking-tight transition-all cursor-pointer ${
              activeMode === "producer"
                ? "bg-white/[0.1] text-white font-semibold border border-white/[0.12] shadow-sm"
                : "text-[#A1A1AA] hover:text-[#FAF9F6]"
            }`}
          >
            For API Vendors (Producers)
          </button>
        </div>
      </div>

      {activeMode === "consumer" ? (
        <div className="rounded-2xl dev-card p-8 sm:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono mb-4">
              <Shield className="w-3.5 h-3.5" />
              <span>Consumer Guardian Mode</span>
            </div>
            <h3 className="font-sans text-2xl sm:text-3xl font-bold text-[#FAF9F6] mb-4">
              Zero downtime from third-party API deprecations
            </h3>
            <p className="text-sm text-[#A1A1AA] leading-relaxed mb-6 font-sans">
              Connect your GitHub Organization once. Aurumend continuously indexes your AST for third-party integrations (Stripe, OpenAI, Twilio, Resend). When any vendor ships a breaking version, you receive a ready-to-merge PR verified against an isolated mock server before legacy endpoints are decommissioned.
            </p>

            <ul className="space-y-3 font-mono text-xs text-[#FAF9F6] mb-8">
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Short-lived JIT GitHub App tokens (no static credentials stored)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Exact AST call-site mapping in source files, controllers, and tests</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Isolated mock contract verification in an E2B microVM</span>
              </li>
            </ul>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.12] text-[#FAF9F6] text-xs font-semibold tracking-tight transition-all cursor-pointer"
            >
              <span>Explore Consumer Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="rounded-xl bg-[#08080c] border border-white/[0.06] p-5 font-mono text-xs shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4 text-[#A1A1AA]">
              <span>aurumend-consumer-cli</span>
              <span className="text-emerald-400">● 4 Repos Active</span>
            </div>
            <div className="space-y-2 text-[11px]">
              <div className="text-zinc-500">$ npx aurumend scan --repo acme/payment-service</div>
              <div className="text-zinc-300">✓ Scanning 38 repository files with @ast-grep Tree-sitter</div>
              <div className="text-amber-300">
                Found 6 active API call-sites:
              </div>
              <div className="pl-4 space-y-1 text-zinc-400">
                <div>• src/services/payment.ts:4 (Stripe SDK constructor)</div>
                <div>• src/services/payment.ts:10 (charges.create)</div>
                <div>• src/api/webhooks/stripe/route.ts:5 (Webhook handler)</div>
                <div>• src/services/assistant.ts:7 (openai.chat.completions)</div>
              </div>
              <div className="text-emerald-400 pt-2 border-t border-white/[0.04]">
                Status: All subscriptions mapped and contract monitoring active.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl dev-card p-8 sm:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-mono mb-4">
              <UploadCloud className="w-3.5 h-3.5" />
              <span>API Provider Portal</span>
            </div>
            <h3 className="font-sans text-2xl sm:text-3xl font-bold text-[#FAF9F6] mb-4">
              Ship breaking versions without stranding developers
            </h3>
            <p className="text-sm text-[#A1A1AA] leading-relaxed mb-6 font-sans">
              Publishing a major v2 API version no longer means managing multi-year deprecation lifecycles or losing customers to upgrade friction. Publish your OpenAPI 3.0 spec to Aurumend to autonomously open verified PRs in your customers&apos; codebases.
            </p>

            <ul className="space-y-3 font-mono text-xs text-[#FAF9F6] mb-8">
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>OASDiff schema diffing generates migration manifests automatically</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Live subscriber telemetry on customer adoption progress</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>CI/CD integration via SHA-256 hashed publisher API keys</span>
              </li>
            </ul>

            <Link
              href="/dashboard/producer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.12] text-[#FAF9F6] text-xs font-semibold tracking-tight transition-all cursor-pointer"
            >
              <span>Explore Provider Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="rounded-xl bg-[#08080c] border border-white/[0.06] p-5 font-mono text-xs shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4 text-[#A1A1AA]">
              <span>aurumend-publish-cli</span>
              <span className="text-amber-400">● 180 Subscribers</span>
            </div>
            <div className="space-y-2 text-[11px]">
              <div className="text-zinc-500">$ npx aurumend publish --spec openapi-v2.json --notes &quot;charges.create sunset&quot;</div>
              <div className="text-zinc-300">✓ Ingesting OpenAPI 3.0 specification</div>
              <div className="text-amber-300">
                OASDiff identified 1 breaking change:
              </div>
              <div className="pl-4 space-y-1 text-zinc-400">
                <div>• POST /v1/charges removed</div>
                <div>• Replacement: POST /v1/payment_intents</div>
              </div>
              <div className="text-emerald-400 pt-2 border-t border-white/[0.04]">
                Enqueued migration pull requests for 180 subscribed repositories.
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
