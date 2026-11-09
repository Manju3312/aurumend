"use client";

import React from "react";

export default function CitadelBentoGrid() {
  const pillars = [
    {
      title: "Rust-Powered Tree-Sitter AST",
      badge: "@ast-grep/napi",
      desc: "Fast, deterministic syntax-tree indexing across TypeScript, Python, and Go codebases. Pinpoints the exact line numbers of deprecated SDK calls, wrapper classes, and route handlers.",
      code: `const matches = root.findAll({\n  rule: { pattern: "$STRIPE.charges.create($$$ARGS)" }\n}); // Found 3 matches in 3.2ms`,
    },
    {
      title: "Structured Migration Manifests",
      badge: "Claude 3.7 Sonnet",
      desc: "Strict JSON schema enforcement converts raw OpenAPI diffs and vendor release notes into deterministic code rewrite instructions and parameter mappings.",
      code: `{\n  "source": "payment_method",\n  "confirm": true,\n  "automatic_payment_methods": { "enabled": true }\n}`,
    },
    {
      title: "E2B MicroVM Verification",
      badge: "Stoplight Prism + E2B",
      desc: "Isolated Firecracker microVM boots in 218ms. Stoplight Prism spins up a local mock server of the new spec while your test suite executes against verified contracts.",
      code: `$ prism mock spec-v2025-04.json -p 4010\n✓ PASS src/services/payment.test.ts\nAll contracts validated. Exit code: 0`,
    },
    {
      title: "Just-In-Time Ephemeral Tokens",
      badge: "@octokit/auth-app",
      desc: "Zero static GitHub access tokens stored in any database. Aurumend mints short-lived, 1-hour installation tokens via RSA private keys on demand for each PR.",
      code: `const { token } = await auth({\n  type: "installation",\n  installationId\n}); // Auto-expires in 3600s`,
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F3EC] border border-[#E5DAC1] shadow-xs mb-3">
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C6515] font-bold">
            Engineering Standard
          </span>
        </div>
        <h2 className="font-sans text-3xl sm:text-5xl font-black tracking-tight text-[#0A0A0A] mb-4">
          Architected for <span className="text-[#BA8C28]">zero regressions</span>.
        </h2>
        <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed">
          Engineered to replace fragile regex replacements and manual PR reviews with deterministic AST transforms and mock contract validation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {pillars.map((p, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-white border border-[#E5DAC1] p-6 flex flex-col justify-between shadow-xs hover:border-[#BA8C28] transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-[#71717A]">
                  0{idx + 1}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F5F3EC] text-[#8C6515] border border-[#E5DAC1] font-semibold">
                  {p.badge}
                </span>
              </div>
              <h3 className="font-sans text-base font-bold text-[#0A0A0A] mb-2">
                {p.title}
              </h3>
              <p className="text-xs text-[#4B5563] leading-relaxed mb-6 font-sans">
                {p.desc}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#0D0D11] border border-[#E5DAC1]/50 font-mono text-[10px] text-zinc-300 overflow-x-auto">
              <pre>{p.code}</pre>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
