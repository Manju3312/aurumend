"use client";

import React from "react";
import Link from "next/link";
import { Terminal, Github, ArrowRight, Star } from "lucide-react";

interface NavbarProps {
  onOpenGitHubModal?: () => void;
}

export default function Navbar({ onOpenGitHubModal }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-[#070709]/80 border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-[#161620] to-[#0a0a0f] border border-amber-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.15)] group-hover:border-amber-400 transition-all">
            <span className="font-sans font-black text-sm tracking-tighter text-[#F3E5AB]">AU</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="font-sans font-bold text-base tracking-tight text-[#FAF9F6]">
              Aurumend
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.05] text-[#A1A1AA] border border-white/[0.08]">
              Public Beta
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[#A1A1AA]">
          <Link
            href="#interactive-demo"
            className="hover:text-[#FAF9F6] transition-colors"
          >
            Product Tour
          </Link>
          <Link
            href="#architecture"
            className="hover:text-[#FAF9F6] transition-colors"
          >
            How it Works
          </Link>
          <Link
            href="#dual-engine"
            className="hover:text-[#FAF9F6] transition-colors"
          >
            For Teams & APIs
          </Link>
          <Link
            href="#telemetry-feed"
            className="hover:text-[#FAF9F6] transition-colors"
          >
            Live Stream
          </Link>
          <Link
            href="#roi-calculator"
            className="hover:text-[#FAF9F6] transition-colors"
          >
            ROI Calculator
          </Link>
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-3">
          {/* GitHub Stars pill */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-[#A1A1AA] hover:text-[#FAF9F6] transition-all"
          >
            <Github className="w-3.5 h-3.5" />
            <span>Star</span>
            <span className="ml-1 px-1.5 py-0.2 rounded bg-white/[0.06] text-[10px] text-[#FAF9F6]">
              2.4k
            </span>
          </a>

          {onOpenGitHubModal ? (
            <button
              onClick={onOpenGitHubModal}
              className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-[#A1A1AA] hover:text-[#FAF9F6] px-3.5 py-1.5 rounded-lg border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer"
            >
              <span>Connect GitHub</span>
            </button>
          ) : (
            <Link
              href="/sign-in"
              className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-[#A1A1AA] hover:text-[#FAF9F6] px-3.5 py-1.5 rounded-lg border border-white/[0.08] hover:border-white/20 transition-all"
            >
              <span>Sign In</span>
            </Link>
          )}

          <Link
            href="/dashboard"
            className="px-4 py-1.5 rounded-lg text-xs font-semibold tracking-tight text-[#070709] bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#c29828] hover:brightness-110 shadow-[0_0_20px_rgba(212,175,55,0.25)] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </header>
  );
}

