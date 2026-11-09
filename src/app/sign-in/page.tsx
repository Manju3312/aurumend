"use client";

import React, { useState } from "react";
import RoyalAstCanvas from "@/components/canvas/RoyalAstCanvas";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Github, Sparkles, Shield, ArrowRight, Lock, KeyRound, Building2 } from "lucide-react";
import GitHubConnectionModal from "@/components/dashboard/GitHubConnectionModal";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("architect@aurumend.io");
  const [loading, setLoading] = useState(false);
  const [githubModalOpen, setGithubModalOpen] = useState(false);

  const handleQuickLogin = async (role: "consumer" | "producer" | "hybrid" = "hybrid") => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: "Sovereign Architect",
          githubUsername: "aurumend-admin",
          roleMode: role,
        }),
      });

      if (res.ok) {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-[#070709] overflow-hidden">
      {/* 3D Kintsugi Canvas Background */}
      <RoyalAstCanvas isSimulating={loading} />

      {/* Radial overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-radial from-transparent via-[#070709]/70 to-[#070709]" />

      {/* Sign-in Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl dev-card p-8 shadow-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
            <div className="w-8 h-8 rounded-lg bg-[#14141d] border border-amber-500/30 flex items-center justify-center shadow-sm group-hover:border-amber-400 transition-all">
              <span className="font-sans font-bold text-xs text-amber-300">AU</span>
            </div>
            <span className="font-sans font-bold tracking-tight text-lg text-[#FAF9F6]">
              Aurumend
            </span>
          </Link>
          <h1 className="font-sans text-2xl font-bold tracking-tight text-[#FAF9F6]">
            Sign in to Aurumend
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1 font-sans">
            Connect repositories and automate breaking API migrations
          </p>
        </div>

        {/* Auth Methods */}
        <div className="space-y-3.5 mb-6">
          <button
            onClick={() => handleQuickLogin("consumer")}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider bg-[#161622] hover:bg-[#1f1f2e] text-[#FAF9F6] border border-[#D4AF37]/30 hover:border-[#D4AF37]/70 transition-all flex items-center justify-center gap-3 shadow-md cursor-pointer group"
          >
            <Github className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            <span>Continue with GitHub App</span>
          </button>

          <button
            onClick={() => setGithubModalOpen(true)}
            className="w-full py-2 px-3 rounded-lg text-[11px] font-mono uppercase tracking-wider text-[#A1A1AA] hover:text-[#F3E5AB] bg-black/40 hover:bg-black/70 border border-white/5 hover:border-[#D4AF37]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Custom GitHub App Setup / Sandbox</span>
          </button>

          <button
            onClick={() => handleQuickLogin("producer")}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider bg-[#161622] hover:bg-[#1f1f2e] text-[#FAF9F6] border border-white/10 hover:border-white/30 transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-[#F3E5AB]" />
            <span>Enterprise SAML / Okta SSO</span>
          </button>
        </div>

        <div className="relative my-6 flex items-center justify-center">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-[#111116] px-3 text-[10px] uppercase font-mono tracking-widest text-[#A1A1AA] absolute">
            Or Sovereign Direct
          </span>
        </div>

        {/* Email Direct Access */}
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#A1A1AA] mb-1.5">
              Engineering Work Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#070709] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#FAF9F6] font-mono transition-colors"
              placeholder="architect@company.com"
            />
          </div>

          <button
            onClick={() => handleQuickLogin("hybrid")}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#996515] text-[#070709] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? "Authenticating..." : "Enter Sovereign Dashboard"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-[#A1A1AA]">
          <Link href="/onboarding" className="hover:text-[#F3E5AB] transition-colors">
            Configure Organization →
          </Link>
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-[#D4AF37]" />
            <span>256-Bit TLS</span>
          </span>
        </div>
      </div>

      <GitHubConnectionModal
        isOpen={githubModalOpen}
        onClose={() => setGithubModalOpen(false)}
        installations={[]}
        onRefreshData={() => router.push("/dashboard")}
      />
    </div>
  );
}

