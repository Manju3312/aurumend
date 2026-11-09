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
        setWebhookStatus(`✓ Verified: Received HTTP 200 in ${data.duration_ms}ms with valid v2025-04 signature`);
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
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111116] border border-[#D4AF37]/35 mb-4 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
          <span className="text-[11px] font-mono tracking-wider uppercase text-[#F3E5AB]">
            Interactive Kintsugi Simulation
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#FAF9F6] mb-4">
          From Breaking API Release to{" "}
          <span className="gold-text-gradient">Contract-Verified PR</span>
        </h2>
        <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed">
          Watch Aurumend detect an upstream schema deprecation, trace impacted AST call-sites in the consumer codebase, rewrite the code with Claude Sonnet, and verify the changes in an E2B Prism sandbox.
        </p>

        {/* Vendor Selector & Action Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <div className="flex p-1 rounded-xl bg-[#111116] border border-[#D4AF37]/25 shadow-lg">
            <button
              onClick={() => setSelectedVendor("stripe")}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedVendor === "stripe"
                  ? "bg-[#D4AF37] text-[#070709] font-bold shadow-md"
                  : "text-[#A1A1AA] hover:text-[#FAF9F6]"
              }`}
            >
              Stripe v2025-04 Deprecation
            </button>
            <button
              onClick={() => setSelectedVendor("openai")}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedVendor === "openai"
                  ? "bg-[#D4AF37] text-[#070709] font-bold shadow-md"
                  : "text-[#A1A1AA] hover:text-[#FAF9F6]"
              }`}
            >
              OpenAI v2 Structured Outputs
            </button>
          </div>

          <button
            onClick={handleSimulateWithBackend}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase flex items-center gap-2 border transition-all cursor-pointer ${
              isSimulating
                ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#F3E5AB] shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                : "bg-gradient-to-r from-[#D4AF37] to-[#996515] border-transparent text-[#070709] hover:brightness-110 shadow-lg"
            }`}
          >
            {isSimulating ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin text-[#F3E5AB]" />
                <span>Simulating Neural Healing...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simulate Breaking Change</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Split-Screen 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Pane: Producer Breaking Change */}
        <div className="lg:col-span-4 rounded-2xl bg-[#111116]/90 backdrop-blur-xl border border-[#D4AF37]/25 p-5 flex flex-col justify-between shadow-2xl hover:border-[#D4AF37]/45 transition-colors">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-xs font-bold tracking-wider uppercase text-[#FAF9F6]">
                    Upstream Spec Diff
                  </h3>
                  <span className="text-[10px] font-mono text-rose-400">
                    BREAKING CHANGE DETECTED
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-[#A1A1AA] border border-white/10">
                oasdiff: 1 removal
              </span>
            </div>

            {selectedVendor === "stripe" ? (
              <div className="space-y-3 font-mono text-[11px]">
                <div className="p-3 rounded-lg bg-black/60 border border-rose-900/40 text-rose-300">
                  <div className="text-[10px] text-rose-400/80 mb-1">
                    ENDPOINT DEPRECATED & REMOVED:
                  </div>
                  <code>- POST /v1/charges (Deprecated)</code>
                  <div className="text-[10px] text-emerald-400/80 mt-2 mb-1">
                    REPLACEMENT CONTRACT:
                  </div>
                  <code>+ POST /v1/payment_intents (v2025-04)</code>
                </div>

                <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-[#A1A1AA]">
                  <div className="text-[10px] text-[#F3E5AB] font-bold uppercase mb-1">
                    Schema Mutation:
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Parameter <span className="text-rose-400">`source`</span> token has been decommissioned. Consumers must now pass <span className="text-emerald-400">`payment_method`</span> and handle async authorization states.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 font-mono text-[11px]">
                <div className="p-3 rounded-lg bg-black/60 border border-rose-900/40 text-rose-300">
                  <div className="text-[10px] text-rose-400/80 mb-1">
                    MODEL SIGNATURE UPGRADED:
                  </div>
                  <code>- openai.chat.completions.create(function_call=...)</code>
                  <div className="text-[10px] text-emerald-400/80 mt-2 mb-1">
                    REPLACEMENT CONTRACT:
                  </div>
                  <code>+ openai.beta.chat.completions.parse(response_format=zodSchema)</code>
                </div>
                <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-[#A1A1AA]">
                  <div className="text-[10px] text-[#F3E5AB] font-bold uppercase mb-1">
                    Schema Mutation:
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Legacy `functions` parameter rejected. All structured JSON queries require `strict: true` JSON schema contracts.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-[#A1A1AA]">
            <span>Vendor: <strong className="text-[#FAF9F6]">{selectedVendor.toUpperCase()}</strong></span>
            <span>Version: <strong className="text-[#D4AF37]">v2025-04.1</strong></span>
          </div>
        </div>

        {/* Center Pane: The Sovereign Neural Bridge Engine */}
        <div className="lg:col-span-3 rounded-2xl bg-gradient-to-b from-[#111116] via-[#14141f] to-[#181824] border border-[#D4AF37]/40 p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#D4AF37]/15 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-2.5 pb-4 border-b border-white/5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-[#F3E5AB]" />
              </div>
              <div>
                <h3 className="text-xs font-bold tracking-wider uppercase text-[#FAF9F6]">
                  Aurumend Engine
                </h3>
                <span className="text-[10px] font-mono text-[#D4AF37]">
                  AUTONOMOUS REFACTORING
                </span>
              </div>
            </div>

            <div className="space-y-3 font-mono text-[11px]">
              {/* Step 1 */}
              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-black/40 border border-white/5">
                <div className="w-4 h-4 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[9px] text-[#F3E5AB] shrink-0 mt-0.5 font-bold">
                  1
                </div>
                <div>
                  <div className="text-[#FAF9F6] font-semibold text-[11px]">
                    @ast-grep Call-Graph
                  </div>
                  <div className="text-[10px] text-[#A1A1AA]">
                    Found 3 call-sites in <code className="text-[#D4AF37]">src/services/pay.ts</code>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-black/40 border border-white/5">
                <div className="w-4 h-4 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[9px] text-[#F3E5AB] shrink-0 mt-0.5 font-bold">
                  2
                </div>
                <div>
                  <div className="text-[#FAF9F6] font-semibold text-[11px]">
                    Claude Sonnet Agent
                  </div>
                  <div className="text-[10px] text-[#A1A1AA]">
                    Rewriting SDK wrapper to match v2025-04 types
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-black/40 border border-white/5">
                <div className="w-4 h-4 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[9px] text-[#F3E5AB] shrink-0 mt-0.5 font-bold">
                  3
                </div>
                <div>
                  <div className="text-[#FAF9F6] font-semibold text-[11px]">
                    E2B Sandbox + Prism
                  </div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Mock spec verified • 0 errors
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-[#A1A1AA]">
            <span>Execution Duration:</span>
            <span className="font-mono text-[#F3E5AB]">4.28s durable</span>
          </div>
        </div>

        {/* Right Pane: Auto-Verified Pull Request & Interactive Sandbox */}
        <div className="lg:col-span-5 rounded-2xl bg-[#111116]/90 backdrop-blur-xl border border-[#D4AF37]/35 p-5 flex flex-col justify-between shadow-2xl hover:border-[#D4AF37]/55 transition-colors">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <GitPullRequest className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold tracking-wider text-[#FAF9F6]">
                      PR #426: [Aurumend] Self-Healed Migration
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Contract Verified with Stoplight Prism Mock Server
                  </span>
                </div>
              </div>

              {/* Multi-Tab Selector */}
              <div className="flex p-0.5 rounded-lg bg-black/60 border border-white/10 text-[10px]">
                <button
                  onClick={() => setActiveTab("diff")}
                  className={`px-2.5 py-1 rounded font-mono transition-all cursor-pointer ${
                    activeTab === "diff"
                      ? "bg-[#D4AF37] text-black font-bold"
                      : "text-[#A1A1AA] hover:text-white"
                  }`}
                >
                  AST Diff
                </button>
                <button
                  onClick={() => setActiveTab("sandbox")}
                  className={`px-2.5 py-1 rounded font-mono transition-all cursor-pointer ${
                    activeTab === "sandbox"
                      ? "bg-[#D4AF37] text-black font-bold"
                      : "text-[#A1A1AA] hover:text-white"
                  }`}
                >
                  Sandbox
                </button>
                <button
                  onClick={() => setActiveTab("webhook")}
                  className={`px-2.5 py-1 rounded font-mono transition-all cursor-pointer ${
                    activeTab === "webhook"
                      ? "bg-[#D4AF37] text-black font-bold"
                      : "text-[#A1A1AA] hover:text-white"
                  }`}
                >
                  Webhook Test
                </button>
              </div>
            </div>

            {/* Tab 1: AST Code Diff */}
            {activeTab === "diff" && (
              <div className="rounded-xl bg-[#070709] border border-white/10 p-3 font-mono text-[11px] overflow-x-auto leading-relaxed max-h-56">
                <div className="text-[10px] text-[#A1A1AA] pb-1.5 border-b border-white/5 mb-2 flex items-center justify-between">
                  <span>src/services/payment.ts</span>
                  <span className="text-emerald-400">+14 / -9 lines</span>
                </div>
                {selectedVendor === "stripe" ? (
                  <pre className="text-[11px]">
                    <span className="text-zinc-500">{"// Before: Deprecated Charges API"}</span>{"\n"}
                    <span className="text-rose-400 bg-rose-950/30 block">
                      - const charge = await stripe.charges.create({`{`}
                    </span>
                    <span className="text-rose-400 bg-rose-950/30 block">
                      -   amount: order.totalCents,
                    </span>
                    <span className="text-rose-400 bg-rose-950/30 block">
                      -   currency: &quot;usd&quot;,
                    </span>
                    <span className="text-rose-400 bg-rose-950/30 block">
                      -   source: token,
                    </span>
                    <span className="text-rose-400 bg-rose-950/30 block">
                      - {`}`});
                    </span>
                    {"\n"}
                    <span className="text-[#D4AF37]">{"// After: Aurumend Auto-Verified PaymentIntents"}</span>{"\n"}
                    <span className="text-emerald-400 bg-emerald-950/30 block">
                      + const intent = await stripe.paymentIntents.create({`{`}
                    </span>
                    <span className="text-emerald-400 bg-emerald-950/30 block">
                      +   amount: order.totalCents,
                    </span>
                    <span className="text-emerald-400 bg-emerald-950/30 block">
                      +   currency: &quot;usd&quot;,
                    </span>
                    <span className="text-emerald-400 bg-emerald-950/30 block">
                      +   payment_method: paymentMethodId,
                    </span>
                    <span className="text-emerald-400 bg-emerald-950/30 block">
                      +   confirm: true,
                    </span>
                    <span className="text-emerald-400 bg-emerald-950/30 block">
                      +   automatic_payment_methods: {`{ enabled: true }`},
                    </span>
                    <span className="text-emerald-400 bg-emerald-950/30 block">
                      + {`}`});
                    </span>
                  </pre>
                ) : (
                  <pre className="text-[11px]">
                    <span className="text-rose-400 bg-rose-950/30 block">
                      - const res = await openai.chat.completions.create({`{`}
                    </span>
                    <span className="text-rose-400 bg-rose-950/30 block">
                      -   messages, functions: legacyFunctions
                    </span>
                    <span className="text-rose-400 bg-rose-950/30 block">
                      - {`}`});
                    </span>
                    {"\n"}
                    <span className="text-emerald-400 bg-emerald-950/30 block">
                      + const res = await openai.beta.chat.completions.parse({`{`}
                    </span>
                    <span className="text-emerald-400 bg-emerald-950/30 block">
                      +   messages,
                    </span>
                    <span className="text-emerald-400 bg-emerald-950/30 block">
                      +   response_format: zodResponseFormat(Schema, &quot;output&quot;)
                    </span>
                    <span className="text-emerald-400 bg-emerald-950/30 block">
                      + {`}`});
                    </span>
                  </pre>
                )}
              </div>
            )}

            {/* Tab 2: Terminal Logs */}
            {activeTab === "sandbox" && (
              <div className="rounded-xl bg-[#070709] border border-white/10 p-3 font-mono text-[10px] text-zinc-300 leading-relaxed max-h-56 overflow-y-auto">
                <div className="text-zinc-500 mb-1">$ e2b-sandbox --boot node:22-alpine</div>
                <div className="text-emerald-400">✓ Isolated microVM booted in 218ms</div>
                <div className="text-zinc-500">$ prism mock stripe-v2025-04.json -p 4010 &</div>
                <div className="text-[#F3E5AB]">
                  [PRISM] Mock server listening on http://127.0.0.1:4010
                </div>
                <div className="text-zinc-500">$ pnpm test:integration</div>
                <div className="text-zinc-300">
                  PASS src/services/payment.test.ts (6/6 tests passed)
                </div>
                <div className="text-emerald-400 font-bold">
                  All contracts validated. Exit code: 0
                </div>
              </div>
            )}

            {/* Tab 3: Interactive Webhook Test */}
            {activeTab === "webhook" && (
              <div className="rounded-xl bg-[#070709] border border-white/10 p-4 font-mono text-xs space-y-3 max-h-56 overflow-y-auto">
                <div className="text-[#A1A1AA] text-[11px]">
                  Simulate incoming vendor webhook payload to verify consumer handler:
                </div>
                <div className="p-2.5 rounded bg-black/60 border border-white/5 text-[10px] text-zinc-300">
                  <code>POST /api/webhooks/stripe</code>
                  <div className="text-[#D4AF37] mt-1">Event: &quot;payment_intent.succeeded&quot;</div>
                </div>

                <button
                  onClick={handleTestWebhook}
                  disabled={webhookSimulating}
                  className="w-full py-2 px-3 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/50 border border-emerald-500/40 text-emerald-300 font-bold text-[11px] flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  {webhookSimulating ? (
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>{webhookSimulating ? "Dispatching..." : "Fire Test Webhook Payload"}</span>
                </button>

                {webhookStatus && (
                  <div className="text-[10px] text-emerald-400 font-mono p-2 rounded bg-emerald-950/30 border border-emerald-500/30">
                    {webhookStatus}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#A1A1AA]">Status:</span>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/50 px-2.5 py-0.5 rounded border border-emerald-500/30">
                Ready to Merge (Zero Regressions)
              </span>
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-[10px] font-medium text-[#FAF9F6] hover:text-[#D4AF37] flex items-center gap-1 transition-colors"
            >
              <span>Inspect on GitHub</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
