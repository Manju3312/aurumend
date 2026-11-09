"use client";

import React from "react";
import { GitBranch, Shield, Cpu, RefreshCw, Box, CheckCircle } from "lucide-react";

export default function ArchitectureFlow() {
  const steps = [
    {
      num: "01",
      title: "Vendor Release Ingestion",
      desc: "API Vendors publish v2 OpenAPI specs and release notes via CLI or webhook. OASDiff computes schema removals and parameter alterations.",
      badge: "oasdiff + Claude Sonnet",
    },
    {
      num: "02",
      title: "AST Call-Graph Indexing",
      desc: "Customer repositories are scanned using Rust-backed @ast-grep/napi. Every SDK initialization, fetch call, and webhook handler is mapped to exact line numbers.",
      badge: "Rust Tree-sitter",
    },
    {
      num: "03",
      title: "Self-Healing Transformation",
      desc: "Claude Sonnet refactoring agent applies deterministic rewrites, handles custom wrappers, updates webhook payloads, and refactors unit tests.",
      badge: "Claude 3.7 / Sonnet",
    },
    {
      num: "04",
      title: "Prism Sandbox Verification",
      desc: "Inside an isolated E2B microVM, Stoplight Prism runs a mock server of the new spec. Test suites run until exit code 0 is reached with zero mock errors.",
      badge: "E2B MicroVM + Prism",
    },
    {
      num: "05",
      title: "Contract-Verified Pull Request",
      desc: "A Pull Request is opened with verified execution logs, typechecker diffs, and sunset deadline countdown. Ready for 1-click merge.",
      badge: "GitHub REST API",
    },
  ];

  return (
    <section id="architecture" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-[11px] font-mono tracking-widest uppercase text-[#D4AF37] mb-2 block">
          End-to-End Pipeline
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#FAF9F6] mb-4">
          The 5 Pillars of <span className="gold-text-gradient">Digital Kintsugi</span>
        </h2>
        <p className="text-sm sm:text-base text-[#A1A1AA]">
          How Aurumend turns breaking changes into verified Pull Requests without human toil.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {steps.map((s, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-[#111116]/80 backdrop-blur-md border border-[#D4AF37]/20 flex flex-col justify-between hover:border-[#D4AF37]/50 hover:bg-[#161622] transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-serif text-2xl font-bold text-[#F3E5AB]">
                  {s.num}
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-black/60 text-[#D4AF37] border border-[#D4AF37]/30">
                  {s.badge}
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#FAF9F6] mb-2 group-hover:text-[#F3E5AB] transition-colors">
                {s.title}
              </h3>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

