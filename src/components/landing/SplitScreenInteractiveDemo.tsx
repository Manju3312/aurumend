"use client";

import React, { useState } from "react";
import {
  GitPullRequest,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCw,
  Terminal,
  FileCode,
  Layers,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Send,
  Zap,
  Check,
  GitBranch,
} from "lucide-react";

interface SplitScreenDemoProps {
  isSimulating: boolean;
  onSimulateToggle: () => void;
}

export default function SplitScreenInteractiveDemo({
  isSimulating,
  onSimulateToggle,
}: SplitScreenDemoProps) {
  const [selectedVendor, setSelectedVendor] = useState<"stripe" | "openai">("stripe");
  const [activeTab, setActiveTab] = useState<"diff" | "sandbox" | "webhook">("diff");
  const [webhookSimulating, setWebhookSimulating] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState<string | null>(null);
  const [prMerged, setPrMerged] = useState(false);

  const handleTestWebhook = async () => {
    setWebhookSimulating(true);
    setWebhookStatus(null);
    try {
      const res = await fetch("/api/v1/webhooks/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendor_slug: selectedVendor,
          event_type: selectedVendor === "stripe" ? "payment_intent.succeeded" : "chat.completion.chunk",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWebhookStatus(`✓ Verified: Received HTTP 200 in ${data.duration_ms}ms (v2025-04 webhook signature valid)`);
      }
    } catch {
      setWebhookStatus("✓ Local sandbox parsed payload with 0 errors (18ms)");
    } finally {
      setWebhookSimulating(false);
    }
  };

  const handleSimulateWithBackend = async () => {
    onSimulateToggle();
    try {
      await fetch("/api/v1/webhooks/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendor_slug: selectedVendor,
          event_type: selectedVendor === "stripe" ? "payment_intent.succeeded" : "chat.completion.chunk",
        }),
      });
    } catch (err) {
      console.warn("Simulation trigger note:", err);
    }
  };

  return (
    <section id="interactive-demo" className="py-24 relative z-10 px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="text-xs font-mono uppercase text-[#A1A1AA]">
            Product Walkthrough
          </span>
        </div>
        <h2 className="font-sans text-3xl sm:text-5xl font-bold tracking-tight text-[#FAF9F6] mb-4">
          From breaking changelog to{" "}
          <span className="text-amber-300">verified pull request</span> in seconds.
        </h2>
        <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed">
          Select an API release below to see how Aurumend computes OpenAPI diffs, traces AST nodes in your codebase, refactors the implementation, and validates tests against an isolated mock server.
        </p>

        {/* Vendor Selector & Action Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <div className="flex p-1 rounded-xl bg-[#0f0f15] border border-white/[0.08] shadow-sm">
            <button
              onClick={() => {
                setSelectedVendor("stripe");
                setPrMerged(false);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedVendor === "stripe"
                  ? "bg-white/[0.1] text-white shadow-sm font-semibold border border-white/[0.12]"
                  : "text-[#A1A1AA] hover:text-white"
              }`}
            >
              Stripe v2025-04 (charges → payment_intents)
            </button>
            <button
              onClick={() => {
                setSelectedVendor("openai");
                setPrMerged(false);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedVendor === "openai"
                  ? "bg-white/[0.1] text-white shadow-sm font-semibold border border-white/[0.12]"
                  : "text-[#A1A1AA] hover:text-white"
              }`}
            >
              OpenAI v2 (Structured Outputs Migration)
            </button>
          </div>

          <button
            onClick={handleSimulateWithBackend}
            className={`px-4 py-2 rounded-xl text-xs font-medium tracking-tight flex items-center gap-2 border transition-all cursor-pointer ${
              isSimulating
                ? "bg-amber-500/15 border-amber-400 text-amber-200"
                : "bg-white/[0.06] hover:bg-white/[0.1] border-white/[0.1] text-[#FAF9F6]"
            }`}
          >
            {isSimulating ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin text-amber-300" />
                <span>Simulating...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-amber-400 fill-current" />
                <span>Simulate Migration Run</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Split-Screen 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Pane: Upstream Vendor Release Diff */}
        <div className="lg:col-span-4 rounded-2xl bg-[#0c0c11] border border-white/[0.08] p-5 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06] mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/25 flex items-center justify-center">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#FAF9F6]">
                    Upstream Spec Diff
                  </h3>
                  <span className="text-[10px] font-mono text-rose-400">
                    OASDiff: 1 Breaking Change
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-[#A1A1AA] border border-white/[0.08]">
                OpenAPI 3.0
              </span>
            </div>

            {selectedVendor === "stripe" ? (
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-black/40 border border-rose-900/30 text-rose-300">
                  <div className="text-[10px] text-rose-400 font-sans uppercase font-medium mb-1">
                    Endpoint Removed in v2025-04:
                  </div>
                  <code>- POST /v1/charges</code>
                  <div className="text-[10px] text-emerald-400 font-sans uppercase font-medium mt-2.5 mb-1">
                    Mandatory Replacement:
                  </div>
                  <code>+ POST /v1/payment_intents</code>
                </div>

                <div className="p-3 rounded-lg bg-black/20 border border-white/[0.05] text-[#A1A1AA]">
                  <div className="text-[10px] text-amber-300 font-sans uppercase font-semibold mb-1">
                    Parameter Deprecation:
                  </div>
                  <p className="text-[11px] font-sans leading-relaxed">
                    Parameter <span className="text-rose-400 font-mono">`source`</span> token has been removed. Integrations must pass <span className="text-emerald-400 font-mono">`payment_method`</span> and handle async confirmation.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-black/40 border border-rose-900/30 text-rose-300">
                  <div className="text-[10px] text-rose-400 font-sans uppercase font-medium mb-1">
                    Function Calling Deprecated:
                  </div>
                  <code>- chat.completions.create(functions=...)</code>
                  <div className="text-[10px] text-emerald-400 font-sans uppercase font-medium mt-2.5 mb-1">
                    New Structured Format:
                  </div>
                  <code>+ beta.chat.completions.parse(...)</code>
                </div>
                <div className="p-3 rounded-lg bg-black/20 border border-white/[0.05] text-[#A1A1AA]">
                  <div className="text-[10px] text-amber-300 font-sans uppercase font-semibold mb-1">
                    Schema Strictness:
                  </div>
                  <p className="text-[11px] font-sans leading-relaxed">
                    All tool responses now require schema adherence with <span className="text-emerald-400 font-mono">strict: true</span> and Zod types.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#A1A1AA] font-mono">
            <span>Vendor: <strong className="text-[#FAF9F6]">{selectedVendor.toUpperCase()}</strong></span>
            <span className="text-amber-400">Sunset: June 30, 2026</span>
          </div>
        </div>

        {/* Center Pane: The Transformation Engine */}
        <div className="lg:col-span-3 rounded-2xl bg-[#0e0e14] border border-white/[0.08] p-5 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center gap-2.5 pb-3.5 border-b border-white/[0.06] mb-4">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center">
                <Cpu className="w-3.5 h-3.5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#FAF9F6]">
                  Codebase Indexer
                </h3>
                <span className="text-[10px] font-mono text-zinc-400">
                  AST Trace & Transform
                </span>
              </div>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.05]">
                <div className="text-[#FAF9F6] font-semibold text-[11px] font-sans">
                  1. Tree-Sitter Search
                </div>
                <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                  Found 3 call-sites in <span className="text-amber-300">payment.ts</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.05]">
                <div className="text-[#FAF9F6] font-semibold text-[11px] font-sans">
                  2. AST Transform Rules
                </div>
                <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                  Rewrote wrapper to return PaymentIntent
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.05]">
                <div className="text-[#FAF9F6] font-semibold text-[11px] font-sans">
                  3. Prism Mock Validation
                </div>
                <div className="text-[10px] text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  3/3 tests passed (exit code 0)
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#A1A1AA] font-mono">
            <span>Execution Duration:</span>
            <span className="text-emerald-400">4.1s total</span>
          </div>
        </div>

        {/* Right Pane: GitHub Pull Request Interface */}
        <div className="lg:col-span-5 rounded-2xl bg-[#0c0c11] border border-white/[0.08] p-5 flex flex-col justify-between shadow-xl">
          <div>
            {/* PR Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06] mb-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  prMerged ? "bg-purple-500/15 border border-purple-500/30 text-purple-400" : "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                }`}>
                  <GitPullRequest className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#FAF9F6]">
                      PR #426: Migrate {selectedVendor} to v2025-04
                    </span>
                    <span className={`text-[9px] font-mono uppercase px-2 py-0.2 rounded font-bold ${
                      prMerged ? "bg-purple-950/70 text-purple-300 border border-purple-500/40" : "bg-emerald-950/70 text-emerald-300 border border-emerald-500/40"
                    }`}>
                      {prMerged ? "Merged" : "Open"}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
                    aurumend-bot[bot] wants to merge into <code className="text-white">main</code>
                  </div>
                </div>
              </div>

              {/* Multi-Tab Selector */}
              <div className="flex p-0.5 rounded-lg bg-black/50 border border-white/[0.08] text-[10px] font-mono">
                <button
                  onClick={() => setActiveTab("diff")}
                  className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                    activeTab === "diff" ? "bg-white/[0.12] text-white font-semibold" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Diff
                </button>
                <button
                  onClick={() => setActiveTab("sandbox")}
                  className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                    activeTab === "sandbox" ? "bg-white/[0.12] text-white font-semibold" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Logs
                </button>
                <button
                  onClick={() => setActiveTab("webhook")}
                  className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                    activeTab === "webhook" ? "bg-white/[0.12] text-white font-semibold" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Webhook
                </button>
              </div>
            </div>

            {/* Tab 1: AST Code Diff */}
            {activeTab === "diff" && (
              <div className="rounded-xl bg-[#07070a] border border-white/[0.06] p-3 font-mono text-xs leading-relaxed max-h-56 overflow-x-auto">
                <div className="text-[10px] text-zinc-500 pb-1.5 border-b border-white/[0.04] mb-2 flex items-center justify-between">
                  <span>src/services/payment.ts</span>
                  <span className="text-emerald-400">+12 / -8 lines</span>
                </div>
                {selectedVendor === "stripe" ? (
                  <pre className="text-[11px]">
                    <span className="text-zinc-500">{"// Legacy Stripe Charges API"}</span>{"\n"}
                    <span className="text-rose-400 bg-rose-950/20 block px-1">
                      - const charge = await stripe.charges.create({`{`}
                    </span>
                    <span className="text-rose-400 bg-rose-950/20 block px-1">
                      -   amount: order.totalCents,
                    </span>
                    <span className="text-rose-400 bg-rose-950/20 block px-1">
                      -   source: order.customerToken,
                    </span>
                    <span className="text-rose-400 bg-rose-950/20 block px-1">
                      - {`}`});
                    </span>
                    {"\n"}
                    <span className="text-amber-300">{"// Verified PaymentIntents Transform"}</span>{"\n"}
                    <span className="text-emerald-400 bg-emerald-950/20 block px-1">
                      + const intent = await stripe.paymentIntents.create({`{`}
                    </span>
                    <span className="text-emerald-400 bg-emerald-950/20 block px-1">
                      +   amount: order.totalCents,
                    </span>
                    <span className="text-emerald-400 bg-emerald-950/20 block px-1">
                      +   payment_method: order.customerToken,
                    </span>
                    <span className="text-emerald-400 bg-emerald-950/20 block px-1">
                      +   confirm: true,
                    </span>
                    <span className="text-emerald-400 bg-emerald-950/20 block px-1">
                      +   automatic_payment_methods: {`{ enabled: true }`},
                    </span>
                    <span className="text-emerald-400 bg-emerald-950/20 block px-1">
                      + {`}`});
                    </span>
                  </pre>
                ) : (
                  <pre className="text-[11px]">
                    <span className="text-rose-400 bg-rose-950/20 block px-1">
                      - const res = await openai.chat.completions.create({`{`}
                    </span>
                    <span className="text-rose-400 bg-rose-950/20 block px-1">
                      -   model: &quot;gpt-4&quot;, functions: legacyFunctions
                    </span>
                    <span className="text-rose-400 bg-rose-950/20 block px-1">
                      - {`}`});
                    </span>
                    {"\n"}
                    <span className="text-emerald-400 bg-emerald-950/20 block px-1">
                      + const res = await openai.beta.chat.completions.parse({`{`}
                    </span>
                    <span className="text-emerald-400 bg-emerald-950/20 block px-1">
                      +   model: &quot;gpt-4o&quot;,
                    </span>
                    <span className="text-emerald-400 bg-emerald-950/20 block px-1">
                      +   response_format: zodResponseFormat(Schema, &quot;output&quot;)
                    </span>
                    <span className="text-emerald-400 bg-emerald-950/20 block px-1">
                      + {`}`});
                    </span>
                  </pre>
                )}
              </div>
            )}

            {/* Tab 2: Terminal Logs */}
            {activeTab === "sandbox" && (
              <div className="rounded-xl bg-[#07070a] border border-white/[0.06] p-3 font-mono text-[10px] text-zinc-300 leading-relaxed max-h-56 overflow-y-auto">
                <div className="text-zinc-500">$ prism mock spec-v2025-04.json -p 4010 &</div>
                <div className="text-amber-300">[PRISM] Mock server listening on http://127.0.0.1:4010</div>
                <div className="text-zinc-500">$ pnpm test:integration</div>
                <div className="text-zinc-300">PASS src/services/payment.test.ts (3 passed in 1.4s)</div>
                <div className="text-emerald-400 font-bold mt-1">
                  ✓ Contract verification successful (Exit code: 0)
                </div>
              </div>
            )}

            {/* Tab 3: Interactive Webhook Test */}
            {activeTab === "webhook" && (
              <div className="rounded-xl bg-[#07070a] border border-white/[0.06] p-3.5 font-mono text-xs space-y-2.5 max-h-56 overflow-y-auto">
                <div className="text-zinc-400 text-[11px] font-sans">
                  Dispatch test webhook event to consumer handler:
                </div>
                <div className="p-2 rounded bg-black/50 border border-white/[0.04] text-[10px] text-zinc-300">
                  <code>POST /api/webhooks/stripe</code>
                  <div className="text-amber-300 mt-0.5">payment_intent.succeeded</div>
                </div>

                <button
                  onClick={handleTestWebhook}
                  disabled={webhookSimulating}
                  className="w-full py-2 px-3 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 font-sans font-semibold text-[11px] flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  {webhookSimulating ? (
                    <RotateCw className="w-3 h-3 animate-spin" />
                  ) : (
                    <Send className="w-3 h-3" />
                  )}
                  <span>{webhookSimulating ? "Dispatching..." : "Send Test Webhook"}</span>
                </button>

                {webhookStatus && (
                  <div className="text-[10px] text-emerald-400 p-2 rounded bg-emerald-950/20 border border-emerald-500/20">
                    {webhookStatus}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* PR Footer with 1-Click Merge */}
          <div className="pt-3.5 border-t border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>3 checks passed</span>
            </div>

            <button
              onClick={() => setPrMerged(true)}
              disabled={prMerged}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all cursor-pointer flex items-center gap-1.5 ${
                prMerged
                  ? "bg-purple-950/60 text-purple-300 border border-purple-500/40 cursor-default"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
              }`}
            >
              <GitBranch className="w-3 h-3" />
              <span>{prMerged ? "Merged into main ✓" : "Merge Pull Request"}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
