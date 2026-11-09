import React from "react";
import Link from "next/link";
import { Github, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#E5DAC1] bg-[#FAF9F5] py-14 px-4 sm:px-6 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 rounded-lg bg-[#0A0A0A] border border-[#BA8C28]/40 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-[#BA8C28]" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-sans font-black tracking-tight text-base text-[#0A0A0A]">
                AURUMEND
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#F7EECD] text-[#8C6515] border border-[#E5DAC1]">
                2.5
              </span>
            </div>
          </div>
          <p className="text-xs text-[#4B5563] max-w-sm text-center md:text-left font-sans">
            Automated, contract-verified pull requests for breaking third-party API releases. Built for engineering teams who value zero downtime.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#4B5563] font-semibold">
          <Link href="#interactive-demo" className="hover:text-[#0A0A0A] transition-colors">
            Interactive Demo
          </Link>
          <Link href="#architecture" className="hover:text-[#0A0A0A] transition-colors">
            Pipeline Architecture
          </Link>
          <Link href="/dashboard" className="hover:text-[#0A0A0A] transition-colors">
            Control Plane
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#0A0A0A] flex items-center gap-1.5 transition-colors"
          >
            <Github className="w-3.5 h-3.5 text-[#0A0A0A]" />
            <span>GitHub</span>
          </a>
        </div>

        <div className="text-xs font-mono text-[#71717A] text-center md:text-right">
          <div className="flex items-center justify-center md:justify-end gap-2 text-emerald-700 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            <span>All systems operational (99.99%)</span>
          </div>
          <div className="mt-1 text-[#71717A]">
            © {new Date().getFullYear()} Aurumend, Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
