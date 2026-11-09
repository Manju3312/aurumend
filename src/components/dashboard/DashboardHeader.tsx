"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Shield,
  UploadCloud,
  Github,
  KeyRound,
  Layers,
  ExternalLink,
} from "lucide-react";

interface DashboardHeaderProps {
  currentMode: "consumer" | "producer";
  onModeChange: (mode: "consumer" | "producer") => void;
  orgName: string;
  orgSlug: string;
  onOpenKeyModal: () => void;
  installationsCount: number;
}

export default function DashboardHeader({
  currentMode,
  onModeChange,
  orgName,
  orgSlug,
  onOpenKeyModal,
  installationsCount,
}: DashboardHeaderProps) {
  return (
    <header className="border-b border-[#D4AF37]/20 bg-[#111116]/90 backdrop-blur-xl sticky top-0 z-40 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Organization Title */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-[#070709] border border-[#D4AF37]/40 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.2)] group-hover:border-[#D4AF37] transition-all">
              <span className="font-serif font-black text-lg text-[#F3E5AB]">A</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg tracking-wider text-[#FAF9F6]">
                  AURUMEND
                </span>
                <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-[#D4AF37]/15 text-[#F3E5AB] border border-[#D4AF37]/30">
                  Control Plane
                </span>
              </div>
              <div className="text-[11px] font-mono text-[#A1A1AA] flex items-center gap-1.5">
                <span>Org:</span>
                <span className="text-[#FAF9F6] font-semibold">{orgName}</span>
                <span className="text-zinc-600">({orgSlug})</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Central Gold Role Toggle */}
        <div className="inline-flex p-1 rounded-xl bg-[#070709] border border-[#D4AF37]/30 shadow-inner">
          <button
            onClick={() => onModeChange("consumer")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
              currentMode === "consumer"
                ? "bg-gradient-to-r from-[#D4AF37] to-[#996515] text-[#070709] shadow-md font-bold"
                : "text-[#A1A1AA] hover:text-[#FAF9F6]"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Consumer Engineering</span>
          </button>
          <button
            onClick={() => onModeChange("producer")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
              currentMode === "producer"
                ? "bg-gradient-to-r from-[#D4AF37] to-[#996515] text-[#070709] shadow-md font-bold"
                : "text-[#A1A1AA] hover:text-[#FAF9F6]"
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>API Producer Portal</span>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenKeyModal}
            className="px-3.5 py-2 rounded-lg text-xs font-medium text-[#FAF9F6] hover:text-[#F3E5AB] bg-[#161622] hover:bg-[#1f1f2e] border border-white/10 hover:border-[#D4AF37]/40 transition-all flex items-center gap-2 cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>API Keys</span>
          </button>

          <a
            href="/api/github/install"
            className="px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase bg-[#161622] hover:bg-[#1f1f2e] text-[#FAF9F6] border border-[#D4AF37]/30 hover:border-[#D4AF37]/70 transition-all flex items-center gap-2 shadow"
          >
            <Github className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>
              {installationsCount > 0 ? `${installationsCount} GitHub Linked` : "Connect GitHub App"}
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}

