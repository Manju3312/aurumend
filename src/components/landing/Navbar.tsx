"use client";

import React from "react";
import Link from "next/link";
import { Github, ArrowRight } from "lucide-react";

interface NavbarProps {
  onOpenGitHubModal?: () => void;
}

export default function Navbar({ onOpenGitHubModal }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#FAF9F5]/90 border-b border-[#E5DAC1] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 rounded-lg bg-[#0A0A0A] border border-[#BA8C28]/40 flex items-center justify-center shadow-xs group-hover:border-[#BA8C28] transition-all">
            <span className="font-sans font-black text-sm tracking-tighter text-[#BA8C28]">
              AU
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="font-sans font-black text-base tracking-tight text-[#0A0A0A]">
              Aurumend
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F5F3EC] text-[#8C6515] border border-[#E5DAC1] font-semibold">
              Public Beta
            </span>
          </div>
        </Link>

        {/* Center Nav Links (Restored to exact previous names) */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-[#4B5563]">
          <Link
            href="#interactive-demo"
            className="hover:text-[#0A0A0A] transition-colors"
          >
            Product Tour
          </Link>
          <Link
            href="#architecture"
            className="hover:text-[#0A0A0A] transition-colors"
          >
            How it Works
          </Link>
          <Link
            href="#dual-engine"
            className="hover:text-[#0A0A0A] transition-colors"
          >
            For Teams & APIs
          </Link>
          <Link
            href="#telemetry-feed"
            className="hover:text-[#0A0A0A] transition-colors"
          >
            Live Stream
          </Link>
          <Link
            href="#roi-calculator"
            className="hover:text-[#0A0A0A] transition-colors"
          >
            ROI Calculator
          </Link>
        </nav>

        {/* Action CTAs (Restored to exact previous navbar buttons) */}
        <div className="flex items-center gap-3">
          {/* GitHub Stars pill */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#F5F3EC] border border-[#DFD2B5] text-xs font-semibold text-[#4B5563] hover:text-[#0A0A0A] transition-all shadow-xs"
          >
            <Github className="w-3.5 h-3.5 text-[#0A0A0A]" />
            <span>Star</span>
            <span className="ml-1 px-1.5 py-0.2 rounded bg-[#F5F3EC] text-[10px] text-[#0A0A0A] font-mono font-bold border border-[#E5DAC1]">
              2.4k
            </span>
          </a>

          {onOpenGitHubModal ? (
            <button
              onClick={onOpenGitHubModal}
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-[#0A0A0A] hover:bg-[#F5F3EC] px-3.5 py-1.5 rounded-lg border border-[#DFD2B5] transition-all cursor-pointer shadow-xs bg-white"
            >
              <span>Connect GitHub</span>
            </button>
          ) : (
            <Link
              href="/sign-in"
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-[#0A0A0A] hover:bg-[#F5F3EC] px-3.5 py-1.5 rounded-lg border border-[#DFD2B5] transition-all shadow-xs bg-white"
            >
              <span>Sign In</span>
            </Link>
          )}

          <Link
            href="/dashboard"
            className="px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide text-[#FAF9F5] bg-[#0A0A0A] hover:bg-[#1C1C22] shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#BA8C28]" />
          </Link>
        </div>
      </div>
    </header>
  );
}
