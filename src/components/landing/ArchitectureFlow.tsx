"use client";

import React from "react";
import { GitBranch, Shield, Cpu, RefreshCw, Box, CheckCircle } from "lucide-react";

export default function ArchitectureFlow() {
  const steps = [
    {
      num: "01",
      title: "OpenAPI Spec Ingestion",
      desc: "OASDiff compares previous and new OpenAPI specifications to detect removed endpoints, deprecated parameters, and breaking type schema alterations.",
      badge: "oasdiff + Claude",
    },
    {
      num: "02",
      title: "AST Call-Graph Indexing",
      desc: "@ast-grep Tree-sitter scans your TypeScript, Python, and Go codebases to locate SDK instantiations, raw fetch calls, and webhook handlers down to the exact line.",
      badge: "Tree-sitter AST",
    },
    {
      num: "03",
      title: "Code Transformation",
      desc: "Deterministic rewrite rules and Claude 3.7 refactor the code to adopt new parameter signatures, update error handlers, and rewrite unit test assertions.",
      badge: "Claude 3.7 Sonnet",
    },
    {
      num: "04",
      title: "Prism Sandbox Verification",
      desc: "Stoplight Prism boots an isolated mock server of the new spec inside an E2B microVM. Integration tests run until 100% of contracts pass (Exit Code: 0).",
      badge: "Stoplight Prism + E2B",
    },
    {
      num: "05",
      title: "Verified Pull Request",
      desc: "A pull request is delivered via an ephemeral 1-hour JIT GitHub token. Includes full sandbox execution logs, typechecker diffs, and 1-click merge.",
      badge: "GitHub REST API",
    },
  ];

  return (
    <section id="architecture" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="text-xs font-mono uppercase text-[#A1A1AA]">
            End-to-End Pipeline
          </span>
        </div>
        <h2 className="font-sans text-3xl sm:text-5xl font-bold tracking-tight text-[#FAF9F6] mb-4">
          How upstream releases become <span className="text-amber-300">verified PRs</span>.
        </h2>
        <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed">
          From the instant a vendor publishes a new schema version to when your tests run, every step is automated, auditable, and deterministic.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {steps.map((s, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl dev-card flex flex-col justify-between shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xl font-bold text-amber-300/80">
                  {s.num}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-zinc-400 border border-white/[0.08]">
                  {s.badge}
                </span>
              </div>
              <h3 className="font-sans text-sm font-semibold text-[#FAF9F6] mb-2">
                {s.title}
              </h3>
              <p className="font-sans text-xs text-[#A1A1AA] leading-relaxed">
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
