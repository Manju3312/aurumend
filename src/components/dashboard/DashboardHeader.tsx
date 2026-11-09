"use client";

import React from "react";
import Link from "next/link";
import {
  Shield,
  UploadCloud,
  Github,
  KeyRound,
  ShieldCheck,
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
    <header className="border-b border-[#E5DAC1] bg-[#FAF9F5]/90 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Organization Title */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] border border-[#BA8C28]/40 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-4 h-4 text-[#BA8C28]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans font-black text-base tracking-tight text-[#0A0A0A]">
                  AURUMEND
                </span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-[#F7EECD] text-[#8C6515] border border-[#E5DAC1] font-semibold">
                  Control Plane
                </span>
              </div>
              <div className="text-[11px] font-mono text-[#71717A] flex items-center gap-1.5">
                <span>Org:</span>
                <span className="text-[#0A0A0A] font-semibold">{orgName}</span>
                <span className="text-[#71717A]">({orgSlug})</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Central Role Toggle */}
        <div className="inline-flex p-1 rounded-xl bg-white border border-[#E5DAC1] shadow-xs font-sans">
          <button
            onClick={() => onModeChange("consumer")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all flex items-center gap-1.5 cursor-pointer ${
              currentMode === "consumer"
                ? "bg-[#0A0A0A] text-[#FAF9F5] shadow-xs"
                : "text-[#4B5563] hover:text-[#0A0A0A]"
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>Consumer Engineering</span>
          </button>
          <button
            onClick={() => onModeChange("producer")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all flex items-center gap-1.5 cursor-pointer ${
              currentMode === "producer"
                ? "bg-[#0A0A0A] text-[#FAF9F5] shadow-xs"
                : "text-[#4B5563] hover:text-[#0A0A0A]"
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5 text-[#BA8C28]" />
            <span>API Provider Portal</span>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenKeyModal}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#4B5563] hover:text-[#0A0A0A] bg-white border border-[#DFD2B5] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#BA8C28]" />
            <span>API Keys</span>
          </button>

          <button
            onClick={onOpenGitHubModal}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-[#FAF9F5] bg-[#0A0A0A] hover:bg-[#1A1A1E] transition-all flex items-center gap-2 shadow-xs cursor-pointer group"
          >
            <Github className="w-3.5 h-3.5 text-[#BA8C28] group-hover:scale-110 transition-transform" />
            <span>{installationsCount > 0 ? "GitHub Connected" : "Connect GitHub"}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </button>
        </div>
      </div>
    </header>
  );
}
