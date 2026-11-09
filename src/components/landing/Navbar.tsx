"use client";

import React from "react";
import Link from "next/link";
import { Zap, FileText, LayoutGrid, ArrowRight, ShieldCheck } from "lucide-react";

interface NavbarProps {
  onOpenGitHubModal?: () => void;
}

export default function Navbar({ onOpenGitHubModal }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#FAF9F5]/90 border-b border-[#E5DAC1]/70 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo from Reference Design */}
        <Link href="/" className="flex items-center gap-2.5 group">
          {/* Obsidian Hexagon / Shield Icon */}
          <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] border border-[#BA8C28]/40 flex items-center justify-center shadow-sm group-hover:border-[#BA8C28] transition-all">
            <ShieldCheck className="w-4 h-4 text-[#BA8C28]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-sans font-black text-sm tracking-tight text-[#0A0A0A]">
                AURUMEND
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#F7EECD] text-[#8C6515] border border-[#E5DAC1]">
                2.5
              </span>
            </div>
            <span className="text-[8px] font-mono tracking-wider uppercase text-[#71717A] leading-none">
              SOVEREIGN RESILIENCE & DRIFT CONTAINMENT
            </span>
          </div>
        </Link>

        {/* Center Nav Links directly matching screenshot */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-[#4B5563]">
          <Link
            href="#interactive-demo"
            className="flex items-center gap-1.5 hover:text-[#0A0A0A] transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-[#BA8C28]" />
            <span>BreakMyAPI Arena</span>
          </Link>
          <Link
            href="#architecture"
            className="hover:text-[#0A0A0A] transition-colors"
          >
            Two Paths Architecture
          </Link>
          <Link
            href="#telemetry-feed"
            className="flex items-center gap-1.5 hover:text-[#0A0A0A] transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-[#10B981]" />
            <span>SOC-2 Audit Ledger</span>
          </Link>
          <Link
            href="#roi-calculator"
            className="hover:text-[#0A0A0A] transition-colors"
          >
            Benchmark
          </Link>
          <Link
            href="#dual-engine"
            className="hover:text-[#0A0A0A] transition-colors"
          >
            Enterprise Plans
          </Link>
        </nav>

        {/* Right Status Pill & CTAs */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Fail-open live indicator badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F5F3EC] border border-[#E5DAC1] text-[10px] font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[#0A0A0A] tracking-wider uppercase">
              FAIL-OPEN ACTIVE
            </span>
            <span className="text-[#71717A]">·</span>
            <span className="text-[#71717A] font-medium tracking-normal">
              &lt;1.2ms P99 OVERHEAD
            </span>
          </div>

          {/* Dashboard pill button */}
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white hover:bg-[#F5F3EC] border border-[#DFD2B5] text-xs font-semibold text-[#0A0A0A] shadow-sm transition-all"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-[#BA8C28]" />
            <span>Dashboard</span>
          </Link>

          {/* Try Arena solid black button with gold text */}
          {onOpenGitHubModal ? (
            <button
              onClick={onOpenGitHubModal}
              className="px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide text-[#FAF9F5] bg-[#0A0A0A] hover:bg-[#1A1A1E] border border-[#0A0A0A] transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>TRY ARENA</span>
              <span className="text-[#BA8C28]">→</span>
            </button>
          ) : (
            <Link
              href="/dashboard"
              className="px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide text-[#FAF9F5] bg-[#0A0A0A] hover:bg-[#1A1A1E] border border-[#0A0A0A] transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>TRY ARENA</span>
              <span className="text-[#BA8C28]">→</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
