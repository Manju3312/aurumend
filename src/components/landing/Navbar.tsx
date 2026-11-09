"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Sparkles, Terminal, Github, ArrowRight } from "lucide-react";

interface NavbarProps {
  onOpenGitHubModal?: () => void;
}

export default function Navbar({ onOpenGitHubModal }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-[#070709]/85 border-b border-[#D4AF37]/25 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#111116] via-[#161622] to-[#1a1a24] border border-[#D4AF37]/40 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.25)] group-hover:border-[#D4AF37] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all">
            <span className="font-serif font-black text-xl text-[#F3E5AB]">A</span>
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] opacity-0 group-hover:opacity-30 blur transition-opacity" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-xl tracking-[0.2em] text-[#FAF9F6] drop-shadow-sm">
                AURUMEND
              </span>
              <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#F3E5AB] border border-[#D4AF37]/35 shadow-inner">
                v1.0 Sovereign
              </span>
            </div>
            <span className="text-[10px] tracking-wider text-[#A1A1AA] uppercase flex items-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Digital Kintsugi for Modern APIs</span>
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-8 font-mono">
          <Link
            href="#interactive-demo"
            className="text-xs uppercase tracking-widest text-[#A1A1AA] hover:text-[#F3E5AB] transition-colors flex items-center gap-1.5"
          >
            <span>Live Bridge</span>
          </Link>
          <Link
            href="#architecture"
            className="text-xs uppercase tracking-widest text-[#A1A1AA] hover:text-[#F3E5AB] transition-colors"
          >
            Architecture
          </Link>
          <Link
            href="#dual-engine"
            className="text-xs uppercase tracking-widest text-[#A1A1AA] hover:text-[#F3E5AB] transition-colors"
          >
            Producer vs Consumer
          </Link>
          <Link
            href="#telemetry-feed"
            className="text-xs uppercase tracking-widest text-[#A1A1AA] hover:text-[#F3E5AB] transition-colors"
          >
            Telemetry
          </Link>
          <Link
            href="#roi-calculator"
            className="text-xs uppercase tracking-widest text-[#A1A1AA] hover:text-[#F3E5AB] transition-colors"
          >
            ROI
          </Link>
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-3.5">
          {onOpenGitHubModal ? (
            <button
              onClick={onOpenGitHubModal}
              className="hidden sm:flex items-center gap-2 text-xs font-medium text-[#FAF9F6] hover:text-[#F3E5AB] px-4 py-2.5 rounded-xl border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 bg-[#111116]/90 hover:bg-[#161622] transition-all shadow-md cursor-pointer group"
            >
              <Github className="w-3.5 h-3.5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
              <span>Connect GitHub</span>
            </button>
          ) : (
            <Link
              href="/sign-in"
              className="hidden sm:flex items-center gap-2 text-xs font-medium text-[#FAF9F6] hover:text-[#F3E5AB] px-4 py-2.5 rounded-xl border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 bg-[#111116]/90 hover:bg-[#161622] transition-all shadow-md group"
            >
              <Github className="w-3.5 h-3.5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
              <span>Connect GitHub</span>
            </Link>
          )}

          <Link
            href="/dashboard"
            className="relative group overflow-hidden px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase text-[#070709] bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#996515] hover:shadow-[0_0_30px_rgba(212,175,55,0.45)] hover:brightness-110 transition-all flex items-center gap-2 shadow-xl"
          >
            <Sparkles className="w-3.5 h-3.5 fill-[#070709]" />
            <span>Enter Protocol</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </header>
  );
}

