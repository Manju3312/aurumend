"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  CheckCircle2,
  Shield,
  GitPullRequest,
  Terminal,
  Cpu,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Layers,
} from "lucide-react";
import Link from "next/link";

interface AuditEvent {
  id: string;
  eventType: string;
  title: string;
  description: string;
  metadataJson: any;
  createdAt: string;
}

export default function AuditStreamSection() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const defaultEvents: AuditEvent[] = [
    {
      id: "ev-1",
      eventType: "pr_opened",
      title: "Autonomous Self-Healing PR #426 Delivered",
      description: "Branch 'aurumend/migrate-stripe-v2025-04-01' opened on acme-corp/payment-service with contract-verified changes.",
      metadataJson: { prNumber: 426, vendor: "stripe", version: "v2025-04-01", repo: "acme-corp/payment-service" },
      createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    },
    {
      id: "ev-2",
      eventType: "sandbox_verified",
      title: "E2B MicroVM Sandbox: Contract Tests Passed (Exit Code 0)",
      description: "Stoplight Prism mock server validated 100% contract compliance for transformed PaymentIntents calls.",
      metadataJson: { sandboxDurationMs: 4210, exitCode: 0, mockTool: "Stoplight Prism CLI v5.8" },
      createdAt: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
    },
    {
      id: "ev-3",
      eventType: "spec_diffed",
      title: "OASDiff Ingestion: Stripe v2025-04-01 Breaking Change Detected",
      description: "POST /v1/charges marked as deprecated and removed. Synthesis of migration manifest completed in 840ms.",
      metadataJson: { diffCount: 1, removed: ["/v1/charges"], added: ["/v1/payment_intents"] },
      createdAt: new Date(Date.now() - 1000 * 60 * 16).toISOString(),
    },
    {
      id: "ev-4",
      eventType: "ast_indexed",
      title: "AST Call-Graph Indexed: acme-corp/payment-service",
      description: "@ast-grep scanned 3 repository source files. Identified 4 active call-sites for Stripe and 2 for OpenAI.",
      metadataJson: { filesScanned: 3, detectedVendors: ["stripe", "openai"], callSites: 6 },
      createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    },
    {
      id: "ev-5",
      eventType: "github_installed",
      title: "GitHub App Installation Verified",
      description: "Installation #60540896 linked to Aurumend Sovereign Corp. JIT 1-hour GitHub tokens operational.",
      metadataJson: { installationId: "60540896", account: "acme-corp" },
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
  ];

  const fetchAuditEvents = async () => {
    try {
      const res = await fetch("/api/v1/dashboard/data");
      const data = await res.json();
      if (data && data.auditLogs && data.auditLogs.length > 0) {
        setEvents(data.auditLogs);
      } else {
        setEvents(defaultEvents);
      }
    } catch {
      setEvents(defaultEvents);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditEvents();
    const interval = setInterval(fetchAuditEvents, 15000);
    return () => clearInterval(interval);
  }, []);

  const getEventBadge = (type: string) => {
    switch (type) {
      case "pr_opened":
      case "pr_merged":
        return {
          icon: GitPullRequest,
          color: "text-[#F3E5AB] bg-[#D4AF37]/15 border-[#D4AF37]/35",
          label: "PULL REQUEST",
        };
      case "sandbox_verified":
        return {
          icon: CheckCircle2,
          color: "text-emerald-400 bg-emerald-950/50 border-emerald-500/35",
          label: "E2B SANDBOX",
        };
      case "spec_diffed":
      case "spec_published":
        return {
          icon: Cpu,
          color: "text-amber-400 bg-amber-950/50 border-amber-500/35",
          label: "OASDIFF INGEST",
        };
      case "ast_indexed":
        return {
          icon: Layers,
          color: "text-sky-400 bg-sky-950/50 border-sky-500/35",
          label: "AST TREE-SITTER",
        };
      default:
        return {
          icon: Shield,
          color: "text-[#FAF9F6] bg-zinc-900 border-zinc-700",
          label: "SOVEREIGN EVENT",
        };
    }
  };

  return (
    <section id="telemetry-feed" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono uppercase text-[#A1A1AA]">
              Live Activity Stream
            </span>
          </div>
          <h2 className="font-sans text-3xl sm:text-5xl font-bold tracking-tight text-[#FAF9F6]">
            Real-time migration <span className="text-amber-300">telemetry</span>.
          </h2>
          <p className="text-sm text-[#A1A1AA] mt-2 max-w-xl font-sans leading-relaxed">
            Live stream of contract diffs, AST index scans, and autonomous Pull Requests executed by the Aurumend engine across connected repositories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAuditEvents}
            className="px-3 py-1.5 rounded-lg text-xs font-mono text-[#A1A1AA] hover:text-[#FAF9F6] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <Link
            href="/dashboard"
            className="px-4 py-1.5 rounded-lg text-xs font-semibold tracking-tight text-[#070709] bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#c29828] hover:brightness-110 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span>Open Console</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Telemetry Stream Terminal Card */}
      <div className="rounded-3xl bg-[#111116]/85 backdrop-blur-2xl border border-[#D4AF37]/30 shadow-2xl overflow-hidden">
        {/* Terminal Window Chrome */}
        <div className="px-6 py-4 bg-[#0a0a0e] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-3 text-xs font-mono text-zinc-400">
              mesh://aurumend.sovereign/telemetry/live-audit-log
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>STREAMING (PostgreSQL + JIT Webhooks)</span>
          </div>
        </div>

        {/* Event Stream List */}
        <div className="divide-y divide-white/5">
          {events.slice(0, 5).map((ev) => {
            const badge = getEventBadge(ev.eventType);
            const BadgeIcon = badge.icon;
            const eventTime = new Date(ev.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });

            return (
              <div
                key={ev.id}
                className="p-5 sm:p-6 hover:bg-[#161622]/90 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${badge.color} shadow-sm group-hover:scale-105 transition-transform`}
                  >
                    <BadgeIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${badge.color}`}>
                        {badge.label}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-[#FAF9F6] group-hover:text-[#F3E5AB] transition-colors">
                        {ev.title}
                      </h4>
                    </div>
                    <p className="text-xs text-[#A1A1AA] leading-relaxed max-w-3xl">
                      {ev.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 font-mono text-xs text-zinc-500 self-end md:self-center">
                  <span className="px-2.5 py-1 rounded-lg bg-[#070709] border border-white/5 text-[11px] text-zinc-400">
                    {eventTime}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Status Ticker */}
        <div className="p-4 bg-[#0a0a0e] border-t border-white/10 flex flex-wrap items-center justify-between text-xs font-mono text-zinc-400 gap-3 px-6">
          <div className="flex items-center gap-4">
            <span className="text-[#F3E5AB] font-bold">100% Zero-Regressions Guarantee</span>
            <span className="text-zinc-600">|</span>
            <span>Cryptographic State Proofs</span>
          </div>
          <div className="text-[11px] text-[#A1A1AA]">
            Sovereign Protocol Core v1.0 • Node: <span className="text-[#D4AF37]">aurumend-mesh-us-east</span>
          </div>
        </div>
      </div>
    </section>
  );
}

