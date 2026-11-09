"use client";

import React from "react";

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
    <section id="architecture" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F3EC] border border-[#E5DAC1] shadow-xs mb-3">
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C6515] font-bold">
            End-to-End Pipeline
          </span>
        </div>
        <h2 className="font-sans text-3xl sm:text-5xl font-black tracking-tight text-[#0A0A0A] mb-4">
          How upstream releases become <span className="text-[#BA8C28]">verified PRs</span>.
        </h2>
        <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed">
          From the instant a vendor publishes a new schema version to when your tests run, every step is automated, auditable, and deterministic.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {steps.map((s, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white border border-[#E5DAC1] flex flex-col justify-between shadow-xs hover:border-[#BA8C28] transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xl font-bold text-[#BA8C28]">
                  {s.num}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F5F3EC] text-[#8C6515] border border-[#E5DAC1] font-semibold">
                  {s.badge}
                </span>
              </div>
              <h3 className="font-sans text-sm font-bold text-[#0A0A0A] mb-2">
                {s.title}
              </h3>
              <p className="font-sans text-xs text-[#4B5563] leading-relaxed">
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
