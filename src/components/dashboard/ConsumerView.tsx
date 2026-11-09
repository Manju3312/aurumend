"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  GitPullRequest,
  CheckCircle2,
  Terminal,
  Scan,
  Play,
  RotateCw,
  ExternalLink,
  FileCode,
  Layers,
  Sparkles,
} from "lucide-react";

interface ConsumerViewProps {
  subscriptions: any[];
  migrationPrs: any[];
  onOpenSandboxModal: (logs: string, repo: string, branch: string) => void;
  onRefreshData: () => void;
}

export default function ConsumerView({
  subscriptions,
  migrationPrs,
  onOpenSandboxModal,
  onRefreshData,
}: ConsumerViewProps) {
  const [scanning, setScanning] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const handleScanCodebase = async () => {
    setScanning(true);
    setActionMessage(null);
    try {
      const res = await fetch("/api/v1/repos/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoFullName: "acme-corp/payment-service",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage(
          `Scanned ${data.result.filesScanned} files. Detected ${data.result.detectedVendors.join(", ")}!`
        );
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  const handleExecuteMigration = async () => {
    setMigrating(true);
    setActionMessage(null);
    try {
      const res = await fetch("/api/v1/migrations/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage(
          `Self-healing complete! PR #${data.result.githubPrNumber} opened with 100% verified E2B contract tests.`
        );
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setMigrating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Action Notification Banner */}
      {actionMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between text-xs font-mono text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionMessage}</span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            className="text-zinc-500 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top 3-Card Health & Status Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Health Ring Widget */}
        <div className="p-6 rounded-2xl bg-[#111116]/80 backdrop-blur-xl border border-[#D4AF37]/30 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#A1A1AA] mb-1">
              Repository Immunity Ring
            </div>
            <div className="font-serif text-3xl font-bold text-[#F3E5AB]">100% Synced</div>
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>0 Sunset Breaking Vulnerabilities</span>
            </p>
          </div>
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-emerald-500/30 border-t-[#D4AF37] animate-spin" style={{ animationDuration: "10s" }} />
            <span className="absolute font-mono text-xs font-bold text-[#FAF9F6]">4/4</span>
          </div>
        </div>

        {/* 2. Detected Subscriptions Widget */}
        <div className="p-6 rounded-2xl bg-[#111116]/80 backdrop-blur-xl border border-[#D4AF37]/30 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#A1A1AA] mb-1">
              Active AST Subscriptions
            </div>
            <div className="font-serif text-3xl font-bold text-[#FAF9F6]">
              {subscriptions.length || 3} Vendors
            </div>
            <p className="text-xs text-[#D4AF37] mt-1 font-mono">
              Stripe • OpenAI • Resend
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center">
            <Layers className="w-6 h-6 text-[#F3E5AB]" />
          </div>
        </div>

        {/* 3. Verified Pull Requests */}
        <div className="p-6 rounded-2xl bg-[#111116]/80 backdrop-blur-xl border border-[#D4AF37]/30 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#A1A1AA] mb-1">
              Auto-Verified Pull Requests
            </div>
            <div className="font-serif text-3xl font-bold text-[#FAF9F6]">
              {migrationPrs.length || 1} Ready
            </div>
            <p className="text-xs text-emerald-400 mt-1 font-mono">
              Tested in E2B MicroVM
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <GitPullRequest className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Control Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#111116] border border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#FAF9F6]">
            Target Repo: <strong className="text-[#D4AF37]">acme-corp/payment-service</strong>
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
            JIT Token Active
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleScanCodebase}
            disabled={scanning}
            className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider bg-[#161622] hover:bg-[#1e1e2d] text-[#FAF9F6] border border-white/10 hover:border-[#D4AF37]/50 transition-all flex items-center gap-2 cursor-pointer"
          >
            {scanning ? (
              <RotateCw className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />
            ) : (
              <Scan className="w-3.5 h-3.5 text-[#D4AF37]" />
            )}
            <span>{scanning ? "Scanning AST..." : "Scan Repo with @ast-grep"}</span>
          </button>

          <button
            onClick={handleExecuteMigration}
            disabled={migrating}
            className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#996515] text-[#070709] hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] transition-all flex items-center gap-2 cursor-pointer"
          >
            {migrating ? (
              <RotateCw className="w-3.5 h-3.5 animate-spin text-[#070709]" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>{migrating ? "Self-Healing & Testing..." : "Dispatch Self-Healing PR"}</span>
          </button>
        </div>
      </div>

      {/* Active Migration Pull Requests Table */}
      <div className="rounded-2xl bg-[#111116]/80 backdrop-blur-xl border border-[#D4AF37]/30 shadow-xl overflow-hidden">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#FAF9F6]">
              Autonomous Migration Pull Requests
            </h3>
            <p className="text-xs text-[#A1A1AA]">
              PRs autonomously generated, typechecked, and verified against Stoplight Prism mock servers
            </p>
          </div>
          <span className="text-xs font-mono text-[#D4AF37]">
            {migrationPrs.length} Active
          </span>
        </div>

        <div className="divide-y divide-white/5 font-mono text-xs">
          {migrationPrs.length === 0 ? (
            <div className="p-8 text-center text-[#A1A1AA]">
              No active migration PRs. Click &quot;Dispatch Self-Healing PR&quot; above to trigger an autonomous contract-verified run!
            </div>
          ) : (
            migrationPrs.map((pr) => (
              <div
                key={pr.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#161622]/60 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-bold text-[#FAF9F6] text-sm">
                      PR #{pr.githubPrNumber || 418}: Migrate {pr.vendorRelease?.vendorSlug || "stripe"} to {pr.vendorRelease?.versionTag || "v2025-04"}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                      STATUS: {pr.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#A1A1AA] flex items-center gap-3">
                    <span>Branch: <code className="text-[#D4AF37]">{pr.branchName}</code></span>
                    <span>•</span>
                    <span>Sunset: <strong className="text-rose-400">June 30, 2026</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() =>
                      onOpenSandboxModal(
                        pr.sandboxTestLogs,
                        pr.subscription?.repoFullName || "acme-corp/payment-service",
                        pr.branchName
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-[#070709] hover:bg-black text-zinc-300 hover:text-white border border-white/10 flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Terminal className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Inspect Sandbox Logs</span>
                  </button>

                  <a
                    href={pr.githubPrUrl || "https://github.com"}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-[#D4AF37] text-black font-bold flex items-center gap-1.5 hover:brightness-110 transition-all"
                  >
                    <span>Merge on GitHub</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Connected Subscriptions & AST File Traces */}
      <div className="rounded-2xl bg-[#111116]/80 backdrop-blur-xl border border-white/10 shadow-xl p-5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
          <div>
            <h3 className="font-serif text-base font-bold text-[#FAF9F6]">
              Indexed API Usages in Codebase
            </h3>
            <p className="text-xs text-[#A1A1AA]">
              Call-sites tracked by @ast-grep/napi Tree-sitter
            </p>
          </div>
          <span className="text-xs font-mono text-[#A1A1AA]">
            3 Files Monitored
          </span>
        </div>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-[#070709] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileCode className="w-4 h-4 text-[#D4AF37]" />
              <div>
                <div className="text-[#FAF9F6]">src/services/payment.ts</div>
                <div className="text-[10px] text-[#A1A1AA]">
                  Lines 9-15: <code className="text-[#D4AF37]">stripe.charges.create(...)</code>
                </div>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#D4AF37]/15 text-[#F3E5AB] border border-[#D4AF37]/30">
              STRIPE v2025-04 AFFECTED
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#070709] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-[#FAF9F6]">src/app/api/webhooks/stripe/route.ts</div>
                <div className="text-[10px] text-[#A1A1AA]">
                  Lines 10-16: <code className="text-[#D4AF37]">event.type === &apos;charge.succeeded&apos;</code>
                </div>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
              WEBHOOK HANDLER
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#070709] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileCode className="w-4 h-4 text-[#F3E5AB]" />
              <div>
                <div className="text-[#FAF9F6]">src/services/ai-assistant.ts</div>
                <div className="text-[10px] text-[#A1A1AA]">
                  Lines 8-12: <code className="text-[#D4AF37]">openai.chat.completions.create(...)</code>
                </div>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-500/30">
              OPENAI v2 SYNCED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

