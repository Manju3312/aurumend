import React from "react";
import Link from "next/link";
import { Github, Twitter, Terminal, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#D4AF37]/20 bg-[#070709] py-16 px-6 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#111116] border border-[#D4AF37]/40 flex items-center justify-center">
              <span className="font-serif font-bold text-sm text-[#F3E5AB]">A</span>
            </div>
            <span className="font-serif font-bold tracking-widest text-lg text-[#FAF9F6]">
              AURUMEND
            </span>
          </div>
          <p className="text-xs text-[#A1A1AA] max-w-sm text-center md:text-left">
            The Sovereign Protocol for Self-Healing APIs. Transforming breaking changes into contract-verified pull requests.
          </p>
        </div>

        <div className="flex items-center gap-8 text-xs font-mono text-[#A1A1AA]">
          <Link href="#architecture" className="hover:text-[#F3E5AB] transition-colors">
            Architecture
          </Link>
          <Link href="#interactive-demo" className="hover:text-[#F3E5AB] transition-colors">
            Live Demo
          </Link>
          <Link href="/dashboard" className="hover:text-[#F3E5AB] transition-colors">
            Dashboard
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#FAF9F6] flex items-center gap-1.5 transition-colors"
          >
            <Github className="w-4 h-4 text-[#D4AF37]" />
            <span>GitHub App</span>
          </a>
        </div>

        <div className="text-[11px] font-mono text-zinc-500 text-center md:text-right">
          <div>Built with React 19, Three.js, E2B & Claude Sonnet.</div>
          <div className="text-[#996515] mt-1">© {new Date().getFullYear()} Aurumend Protocol. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}

