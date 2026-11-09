"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, UploadCloud, Layers, ArrowRight, Check, ShieldCheck } from "lucide-react";

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
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-[#FAF9F5] overflow-hidden">
      {/* Soft warm radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#F7EECD]/70 via-[#E8DEC8]/40 to-transparent rounded-full blur-[130px] pointer-events-none -z-10" />

      <div className="relative z-10 w-full max-w-xl rounded-2xl bg-white border border-[#E5DAC1] p-8 sm:p-10 shadow-xs">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F3EC] border border-[#E5DAC1] text-xs font-mono mb-3 text-[#8C6515] font-bold">
            <span>Setup Organization</span>
          </div>
          <h1 className="font-sans text-3xl font-black tracking-tight text-[#0A0A0A]">
            Configure your workspace
          </h1>
          <p className="text-xs text-[#4B5563] mt-1 font-sans">
            Select your operating mode to personalize your Aurumend dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#71717A] mb-1.5 font-bold">
                Organization Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-"));
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#E5DAC1] focus:border-[#BA8C28] focus:outline-none text-xs text-[#0A0A0A] font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#71717A] mb-1.5 font-bold">
                Organization Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#E5DAC1] focus:border-[#BA8C28] focus:outline-none text-xs text-[#0A0A0A] font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-[#71717A] mb-3 font-bold">
              Operating Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: "consumer",
                  title: "Consumer",
                  desc: "I consume third-party APIs (Stripe, OpenAI). Automate incoming breaking changes.",
                  icon: Shield,
                },
                {
                  id: "producer",
                  title: "API Producer",
                  desc: "I publish an API. Generate migration manifests and tested PRs for my customers.",
                  icon: UploadCloud,
                },
                {
                  id: "hybrid",
                  title: "Hybrid",
                  desc: "Dual-mode: monitor incoming dependencies & distribute outgoing breaking revisions.",
                  icon: Layers,
                },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = roleMode === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setRoleMode(m.id as any)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#F7EECD] border-[#BA8C28] shadow-xs"
                        : "bg-[#FAF9F5] border-[#E5DAC1] hover:border-[#BA8C28]/60"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`w-4 h-4 ${isSelected ? "text-[#BA8C28]" : "text-[#71717A]"}`} />
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#BA8C28]" />}
                    </div>
                    <div className="font-bold text-xs text-[#0A0A0A] mb-1">
                      {m.title}
                    </div>
                    <div className="text-[10px] text-[#4B5563] leading-relaxed">
                      {m.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 px-4 rounded-xl text-xs font-bold tracking-wide bg-[#0A0A0A] hover:bg-[#1C1C22] text-[#FAF9F5] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>{saving ? "Configuring Workspace..." : "Initialize Workspace & Launch Dashboard"}</span>
            <ArrowRight className="w-4 h-4 text-[#BA8C28]" />
          </button>
        </form>
      </div>
    </div>
  );
}
