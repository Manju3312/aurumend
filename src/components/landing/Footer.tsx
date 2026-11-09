import React from "react";
import Link from "next/link";
import { Github, Twitter, Terminal, Shield, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#07070a] py-14 px-6 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 rounded-lg bg-[#14141d] border border-amber-500/30 flex items-center justify-center">
              <span className="font-sans font-bold text-xs text-amber-300">AU</span>
            </div>
            <span className="font-sans font-bold tracking-tight text-base text-[#FAF9F6]">
              Aurumend
            </span>
          </div>
          <p className="text-xs text-[#A1A1AA] max-w-sm text-center md:text-left font-sans">
            Automated, contract-verified pull requests for breaking third-party API releases. Built for engineering teams who value zero downtime.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#A1A1AA] font-sans">
          <Link href="#interactive-demo" className="hover:text-white transition-colors">
            Interactive Demo
          </Link>
          <Link href="#architecture" className="hover:text-white transition-colors">
            Pipeline Architecture
          </Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">
            Control Plane
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
        </div>

        <div className="text-xs font-mono text-zinc-500 text-center md:text-right">
          <div className="flex items-center justify-center md:justify-end gap-2 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>All systems operational (99.99%)</span>
          </div>
          <div className="mt-1 text-zinc-600">
            © {new Date().getFullYear()} Aurumend, Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
