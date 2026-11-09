"use client";

import React, { useState } from "react";
import { KeyRound, X, Copy, Check, Plus, AlertCircle } from "lucide-react";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  keys: Array<{
    id: string;
    name: string;
    keyPrefix: string;
    scopes: string[];
    createdAt: string;
  }>;
  onKeyCreated: () => void;
}

export default function ApiKeyModal({
  isOpen,
  onClose,
  keys,
  onKeyCreated,
}: ApiKeyModalProps) {
  const [name, setName] = useState("");
  const [newRawKey, setNewRawKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/v1/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name || "CI/CD Release Publisher" }),
      });
      const data = await res.json();
      if (data.apiKey?.rawKey) {
        setNewRawKey(data.apiKey.rawKey);
        setName("");
        onKeyCreated();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyKey = () => {
    if (newRawKey) {
      navigator.clipboard.writeText(newRawKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#111116] border border-[#D4AF37]/40 shadow-2xl p-6 overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center">
              <KeyRound className="w-4 h-4 text-[#F3E5AB]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#FAF9F6]">API Keys (CLI & CI/CD)</h3>
              <p className="text-[11px] text-[#A1A1AA]">
                Hashed with SHA-256. Use with <code className="text-[#D4AF37]">Authorization: Bearer aur_live_...</code>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Newly generated raw key banner */}
        {newRawKey && (
          <div className="mb-6 p-4 rounded-xl bg-amber-950/30 border border-[#D4AF37]/50">
            <div className="flex items-center gap-2 text-xs font-bold text-[#F3E5AB] mb-1.5">
              <AlertCircle className="w-4 h-4 text-[#D4AF37]" />
              <span>Copy your new API key now!</span>
            </div>
            <p className="text-[11px] text-[#A1A1AA] mb-3">
              This token will never be displayed again.
            </p>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-black/70 border border-white/10 font-mono text-xs text-[#FAF9F6]">
              <span className="truncate flex-1">{newRawKey}</span>
              <button
                onClick={copyKey}
                className="px-3 py-1 rounded bg-[#D4AF37] text-black font-bold text-xs flex items-center gap-1 shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Create Key Form */}
        <form onSubmit={handleCreate} className="flex gap-2 mb-6">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. GitHub Actions CI / Release Publisher"
            className="flex-1 px-3.5 py-2 rounded-xl bg-[#070709] border border-white/10 text-xs text-[#FAF9F6] font-mono focus:border-[#D4AF37] focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#D4AF37] to-[#996515] text-[#070709] hover:brightness-110 flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{loading ? "Generating..." : "Generate Key"}</span>
          </button>
        </form>

        {/* Existing Keys Table */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono uppercase text-[#A1A1AA] mb-2">Active Keys</div>
          {keys.length === 0 ? (
            <div className="text-xs text-zinc-500 font-mono py-4 text-center">
              No API keys generated yet.
            </div>
          ) : (
            keys.map((k) => (
              <div
                key={k.id}
                className="p-3 rounded-xl bg-[#070709] border border-white/5 flex items-center justify-between text-xs font-mono"
              >
                <div>
                  <div className="text-[#FAF9F6] font-medium">{k.name}</div>
                  <div className="text-[10px] text-zinc-500">
                    Prefix: <span className="text-[#D4AF37]">{k.keyPrefix}••••••••</span> • Created {new Date(k.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-500/20">
                  SHA-256 Hashed
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

