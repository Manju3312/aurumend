"use client";

import React, { useState } from "react";
import RoyalAstCanvas from "@/components/canvas/RoyalAstCanvas";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, UploadCloud, Layers, ArrowRight, Check, Sparkles } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [name, setName] = useState("Acme Technologies");
  const [slug, setSlug] = useState("acme-tech");
  const [roleMode, setRoleMode] = useState<"consumer" | "producer" | "hybrid">("hybrid");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: "lead@acme.com",
          roleMode,
        }),
      });

      if (res.ok) {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-[#070709] overflow-hidden">
      <RoyalAstCanvas isSimulating={saving} />
      <div className="pointer-events-none fixed inset-0 z-0 bg-radial from-transparent via-[#070709]/70 to-[#070709]" />

      <div className="relative z-10 w-full max-w-xl rounded-2xl bg-[#111116]/90 backdrop-blur-2xl border border-[#D4AF37]/30 p-8 sm:p-10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F3E5AB] text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Organization Initialization</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#FAF9F6]">
            Configure Your Protocol Spine
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Choose your organization&apos;s operating model across the sovereign network
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#A1A1AA] mb-1.5">
                Organization Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-"));
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-[#070709] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#FAF9F6] font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#A1A1AA] mb-1.5">
                Sovereign Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#070709] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#FAF9F6] font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-[#A1A1AA] mb-3">
              Select Protocol Role Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Consumer Mode */}
              <button
                type="button"
                onClick={() => setRoleMode("consumer")}
                className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                  roleMode === "consumer"
                    ? "bg-[#D4AF37]/15 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                    : "bg-[#070709] border-white/10 hover:border-white/30"
                }`}
              >
                <Shield className="w-5 h-5 text-emerald-400 mb-2" />
                <div className="text-xs font-bold text-[#FAF9F6]">Consumer</div>
                <div className="text-[10px] text-[#A1A1AA] mt-1 leading-snug">
                  Protect repositories from upstream vendor deprecations.
                </div>
              </button>

              {/* Producer Mode */}
              <button
                type="button"
                onClick={() => setRoleMode("producer")}
                className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                  roleMode === "producer"
                    ? "bg-[#D4AF37]/15 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                    : "bg-[#070709] border-white/10 hover:border-white/30"
                }`}
              >
                <UploadCloud className="w-5 h-5 text-[#F3E5AB] mb-2" />
                <div className="text-xs font-bold text-[#FAF9F6]">API Producer</div>
                <div className="text-[10px] text-[#A1A1AA] mt-1 leading-snug">
                  Publish OpenAPI specs & auto-open verified PRs for consumers.
                </div>
              </button>

              {/* Hybrid Mode */}
              <button
                type="button"
                onClick={() => setRoleMode("hybrid")}
                className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                  roleMode === "hybrid"
                    ? "bg-[#D4AF37]/15 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                    : "bg-[#070709] border-white/10 hover:border-white/30"
                }`}
              >
                <Layers className="w-5 h-5 text-[#D4AF37] mb-2" />
                <div className="text-xs font-bold text-[#FAF9F6]">Hybrid Network</div>
                <div className="text-[10px] text-[#A1A1AA] mt-1 leading-snug">
                  Both consume external APIs and publish public APIs.
                </div>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#996515] text-[#070709] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{saving ? "Provisioning Organization..." : "Launch Protocol Dashboard"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

