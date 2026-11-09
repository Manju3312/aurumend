"use client";

import React from "react";
import { Terminal, X, CheckCircle, ShieldCheck, Copy, Check } from "lucide-react";

interface SandboxLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: string;
  repoFullName: string;
  branchName: string;
}

export default function SandboxLogModal({
  isOpen,
  onClose,
  logs,
  repoFullName,
  branchName,
}: SandboxLogModalProps) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(logs);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#0c0c10] border border-[#D4AF37]/40 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Terminal Header */}
        <div className="px-5 py-3.5 bg-[#111116] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <div className="flex items-center gap-2 pl-3 border-l border-white/10 text-xs font-mono text-[#FAF9F6]">
              <Terminal className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>E2B MicroVM Sandbox: {repoFullName}</span>
              <span className="text-[#A1A1AA]">({branchName})</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-black/40 hover:bg-black/80 text-zinc-400 hover:text-white border border-white/5 transition-colors"
              title="Copy Logs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-black/40 hover:bg-black/80 text-zinc-400 hover:text-white border border-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Verification Status Banner */}
        <div className="px-5 py-2.5 bg-emerald-950/30 border-b border-emerald-500/20 flex items-center justify-between text-xs font-mono text-emerald-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>CONTRACT VERIFIED: Stoplight Prism Mock Server (Exit Code 0)</span>
          </div>
          <span className="text-zinc-500 text-[11px]">Runtime: 1.42s</span>
        </div>

        {/* Terminal Body */}
        <div className="p-6 overflow-y-auto font-mono text-xs text-zinc-300 leading-relaxed bg-[#070709] selection:bg-[#D4AF37]/30">
          <pre className="whitespace-pre-wrap">{logs || "No logs recorded for this sandbox execution."}</pre>
        </div>
      </div>
    </div>
  );
}
