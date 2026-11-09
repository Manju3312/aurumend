"use client";

import React, { useState } from "react";
import {
  Shield,
  Cpu,
  Lock,
  Zap,
  GitBranch,
  Terminal,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function CitadelBentoGrid() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const pillars = [
    {
      title: "Rust-Powered Tree-Sitter AST",
      badge: "@ast-grep/napi",
      desc: "Instant syntax-tree indexing across TypeScript, Python, and Go codebases. Pinpoints exact line numbers of deprecated SDK methods, wrapper classes, and route handlers.",
      code: `const matches = root.findAll({\n  rule: { pattern: "$STRIPE.charges.create($$$ARGS)" }\n}); // Found in 3ms`,
    },
    {
      title: "Zero-Hallucination Manifests",
      badge: "Claude Sonnet 3.5 / 3.7",
      desc: "Structured JSON schema enforcement converts changelogs into deterministic migration recipes, type parameter mappings, and Stoplight Prism verification fixtures.",
      code: `{\n  "source": "payment_method",\n  "confirm": true,\n  "automatic_payment_methods": { "enabled": true }\n}`,
    },
    {
      title: "E2B MicroVM Verification",
      badge: "@e2b/code-interpreter",
      desc: "Isolated Firecracker microVM boots in 218ms. Stoplight Prism runs live mock servers of the new spec while your test suite executes against verified contracts.",
      code: `$ prism mock spec-v2.json -p 4010\n✓ PASS src/services/pay.test.ts\nExit code: 0`,
    },
    {
      title: "Just-In-Time Ephemeral Tokens",
      badge: "@octokit/auth-app",
      desc: "No static GitHub access tokens stored in your database. Aurumend mints short-lived 1-hour installation tokens via RSA private keys on demand.",
      code: `const { token } = await auth({\n  type: "installation",\n  installationId\n}); // Expires in 3600s`,
    },
  ];

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto relative z-10">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111116] border border-[#D4AF37]/30 mb-4 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
          <Sparkles className="w-3.5 h-3.5 text-[#F3E5AB]" />
          <span className="text-[11px] font-mono tracking-wider uppercase text-[#F3E5AB]">
            The Sovereign Citadel Architecture
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#FAF9F6] mb-4">
          Architected for <span className="gold-text-gradient">Zero-Downtime Resilience</span>
        </h2>
        <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed">
          Engineered from the ground up to replace fragile regex replacements and manual PR reviews with cryptographic precision.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map((p, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-[#111116]/85 backdrop-blur-xl border border-[#D4AF37]/20 p-6 flex flex-col justify-between hover:border-[#D4AF37]/50 hover:bg-[#161622] transition-all group shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center font-serif font-bold text-xs text-[#F3E5AB]">
                  0{idx + 1}
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-black/60 text-[#D4AF37] border border-[#D4AF37]/20">
                  {p.badge}
                </span>
              </div>
              <h3 className="font-serif text-base font-bold text-[#FAF9F6] mb-2 group-hover:text-[#F3E5AB] transition-colors">
                {p.title}
              </h3>
              <p className="text-xs text-[#A1A1AA] leading-relaxed mb-6">
                {p.desc}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#070709] border border-white/5 font-mono text-[10px] text-zinc-300 overflow-x-auto">
              <pre>{p.code}</pre>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
