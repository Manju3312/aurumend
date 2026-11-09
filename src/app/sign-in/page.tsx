"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Github, ArrowRight, Lock, Building2, ShieldCheck } from "lucide-react";
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
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-[#FAF9F5] overflow-hidden">
      {/* Soft warm radial glow behind the card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#F7EECD]/70 via-[#E8DEC8]/40 to-transparent rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Sign-in Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white border border-[#E5DAC1] p-8 shadow-xs">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
            <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] border border-[#BA8C28]/40 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-4 h-4 text-[#BA8C28]" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-sans font-black tracking-tight text-lg text-[#0A0A0A]">
                AURUMEND
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#F7EECD] text-[#8C6515] border border-[#E5DAC1]">
                2.5
              </span>
            </div>
          </Link>
          <h1 className="font-sans text-2xl font-black tracking-tight text-[#0A0A0A]">
            Sign in to Aurumend
          </h1>
          <p className="text-xs text-[#4B5563] mt-1 font-sans">
            Connect repositories and automate breaking API migrations
          </p>
        </div>

        {/* Auth Methods */}
        <div className="space-y-3.5 mb-6">
          <button
            onClick={() => handleQuickLogin("consumer")}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-xs font-bold tracking-wide bg-[#0A0A0A] hover:bg-[#1C1C22] text-[#FAF9F5] transition-all flex items-center justify-center gap-3 shadow-xs cursor-pointer group"
          >
            <Github className="w-4 h-4 text-[#BA8C28] group-hover:scale-110 transition-transform" />
            <span>Continue with GitHub App</span>
          </button>

          <button
            onClick={() => setGithubModalOpen(true)}
            className="w-full py-2 px-3 rounded-lg text-[11px] font-mono uppercase tracking-wider text-[#4B5563] hover:text-[#0A0A0A] bg-[#FAF9F5] hover:bg-[#F5F3EC] border border-[#DFD2B5] transition-all flex items-center justify-center gap-2 cursor-pointer font-semibold"
          >
            <span>Custom GitHub App Setup / Sandbox</span>
          </button>

          <button
            onClick={() => handleQuickLogin("producer")}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-xs font-semibold tracking-wide bg-white hover:bg-[#FAF9F5] text-[#0A0A0A] border border-[#DFD2B5] transition-all flex items-center justify-center gap-3 cursor-pointer shadow-xs"
          >
            <Building2 className="w-4 h-4 text-[#BA8C28]" />
            <span>Enterprise SAML / Okta SSO</span>
          </button>
        </div>

        <div className="relative my-6 flex items-center justify-center">
          <div className="border-t border-[#E5DAC1] w-full" />
          <span className="bg-white px-3 text-[10px] uppercase font-mono tracking-widest text-[#71717A] absolute font-bold">
            Or Direct Work Email
          </span>
        </div>

        {/* Email Direct Access */}
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#71717A] mb-1.5 font-bold">
              Engineering Work Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#E5DAC1] focus:border-[#BA8C28] focus:outline-none text-xs text-[#0A0A0A] font-mono transition-colors"
              placeholder="architect@company.com"
            />
          </div>

          <button
            onClick={() => handleQuickLogin("hybrid")}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-xs font-bold tracking-wide bg-[#0A0A0A] hover:bg-[#1C1C22] text-[#FAF9F5] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>{loading ? "Authenticating..." : "Enter Aurumend Dashboard"}</span>
            <ArrowRight className="w-4 h-4 text-[#BA8C28]" />
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-[#E5DAC1] flex items-center justify-between text-[11px] text-[#71717A]">
          <Link href="/onboarding" className="hover:text-[#0A0A0A] transition-colors font-semibold">
            Configure Organization →
          </Link>
          <span className="flex items-center gap-1 font-mono text-[10px]">
            <Lock className="w-3 h-3 text-[#BA8C28]" />
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
