"use client";

import React from "react";
import Link from "next/link";
import {
  Shield,
  UploadCloud,
  Github,
  KeyRound,
  Layers,
  ArrowRight,
} from "lucide-react";

interface DashboardHeaderProps {
  currentMode: "consumer" | "producer";
  onModeChange: (mode: "consumer" | "producer") => void;
  orgName: string;
  orgSlug: string;
  onOpenKeyModal: () => void;
  onOpenGitHubModal: () => void;
  installationsCount: number;
}

export default function DashboardHeader({
  currentMode,
  onModeChange,
  orgName,
  orgSlug,
  onOpenKeyModal,
  onOpenGitHubModal,
  installationsCount,
}: DashboardHeaderProps) {
  return (
    <header className="border-b border-white/[0.08] bg-[#0c0c11]/90 backdrop-blur-xl sticky top-0 z-40 px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Organization Title */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-[#14141d] border border-amber-500/30 flex items-center justify-center shadow-sm group-hover:border-amber-400 transition-all">
              <span className="font-sans font-bold text-xs text-amber-300">AU</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans font-bold text-base tracking-tight text-[#FAF9F6]">
                  Aurumend
                </span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-white/[0.06] text-zinc-400 border border-white/[0.08]">
                  Control Plane
                </span>
              </div>
              <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-1.5">
                <span>Org:</span>
                <span className="text-zinc-300 font-medium">{orgName}</span>
                <span className="text-zinc-600">({orgSlug})</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Central Role Toggle */}
        <div className="inline-flex p-1 rounded-xl bg-[#07070a] border border-white/[0.08] shadow-inner font-sans">
          <button
            onClick={() => onModeChange("consumer")}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium tracking-tight transition-all flex items-center gap-1.5 cursor-pointer ${
              currentMode === "consumer"
                ? "bg-white/[0.12] text-white font-semibold shadow-sm border border-white/[0.15]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Consumer Engineering</span>
          </button>
          <button
            onClick={() => onModeChange("producer")}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium tracking-tight transition-all flex items-center gap-1.5 cursor-pointer ${
              currentMode === "producer"
                ? "bg-white/[0.12] text-white font-semibold shadow-sm border border-white/[0.15]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5 text-amber-400" />
            <span>API Provider Portal</span>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenKeyModal}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>API Keys</span>
          </button>

          <button
            onClick={onOpenGitHubModal}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-zinc-200 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] hover:border-amber-400/40 transition-all flex items-center gap-2 shadow-sm cursor-pointer group"
          >
            <Github className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>
              {installationsCount > 0 ? `${installationsCount} Repos Linked` : "Connect GitHub App"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
