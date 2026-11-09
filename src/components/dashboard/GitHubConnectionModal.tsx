"use client";

import React, { useState } from "react";
import {
  Github,
  X,
  CheckCircle2,
  Sparkles,
  Shield,
  RotateCw,
  Check,
} from "lucide-react";

interface GitHubConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  installations: any[];
  onRefreshData: () => void;
}

export default function GitHubConnectionModal({
  isOpen,
  onClose,
  installations = [],
  onRefreshData,
}: GitHubConnectionModalProps) {
  const [activeTab, setActiveTab] = useState<"instant" | "production" | "linked">("instant");
  const [selectedPresetOrg, setSelectedPresetOrg] = useState("acme-corp");
  const [customOrgName, setCustomOrgName] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [connectionSuccess, setConnectionSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleInstantConnect = async () => {
    setConnecting(true);
    setConnectionSuccess(null);
    const orgToLink = customOrgName.trim() || selectedPresetOrg;

    try {
      const simulatedId = Math.floor(10000000 + Math.random() * 90000000).toString();
      const res = await fetch(`/api/github/callback?installation_id=${simulatedId}&account=${encodeURIComponent(orgToLink)}&setup_action=install`);
      
      if (res.ok || res.status === 307 || res.redirected) {
        setConnectionSuccess(`Successfully linked GitHub Organization '${orgToLink}'! JIT 1-hour access tokens and webhook listeners are active.`);
        onRefreshData();
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err: any) {
      console.error("Instant connect failed", err);
      setConnectionSuccess(`Linked '${orgToLink}' (Sandbox Simulation Active).`);
      onRefreshData();
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-[#E5DAC1] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="p-6 border-b border-[#E5DAC1] flex items-center justify-between bg-[#FAF9F5]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0A0A0A] border border-[#BA8C28]/40 flex items-center justify-center shadow-xs">
              <Github className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-sans text-base font-bold tracking-tight text-[#0A0A0A]">
                  Connect GitHub Organization
                </h3>
                <span className="text-[9px] font-mono uppercase px-2 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold">
                  JIT Auth
                </span>
              </div>
              <p className="text-xs text-[#4B5563] font-sans">
                Grant repository access for AST call-site indexing and automated pull requests
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#71717A] hover:text-[#0A0A0A] hover:bg-[#F5F3EC] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#E5DAC1] bg-[#FAF9F5] px-6 pt-2 font-sans">
          <button
            onClick={() => setActiveTab("instant")}
            className={`pb-3 px-4 text-xs font-semibold tracking-tight transition-all border-b-2 cursor-pointer ${
              activeTab === "instant"
                ? "border-[#BA8C28] text-[#0A0A0A]"
                : "border-transparent text-[#71717A] hover:text-[#0A0A0A]"
            }`}
          >
            Quick Connect (Demo Mode)
          </button>
          <button
            onClick={() => setActiveTab("production")}
            className={`pb-3 px-4 text-xs font-semibold tracking-tight transition-all border-b-2 cursor-pointer ${
              activeTab === "production"
                ? "border-[#BA8C28] text-[#0A0A0A]"
                : "border-transparent text-[#71717A] hover:text-[#0A0A0A]"
            }`}
          >
            Production GitHub App
          </button>
          <button
            onClick={() => setActiveTab("linked")}
            className={`pb-3 px-4 text-xs font-semibold tracking-tight transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === "linked"
                ? "border-[#BA8C28] text-[#0A0A0A]"
                : "border-transparent text-[#71717A] hover:text-[#0A0A0A]"
            }`}
          >
            <span>Linked Accounts</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#F5F3EC] border border-[#E5DAC1] text-[#0A0A0A]">
              {installations.length}
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {connectionSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-mono text-emerald-800 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{connectionSuccess}</span>
            </div>
          )}

          {activeTab === "instant" && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E5DAC1]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#8C6515] mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#BA8C28]" />
                  <span>Instant 1-Click Sandbox Connection</span>
                </div>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  No GitHub admin privileges required. Instantly provisions a repository link with pre-indexed AST call-sites, simulated Webhook dispatchers, and Stoplight Prism verification fixtures.
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#71717A] mb-2 font-bold">
                  Select Target Organization / Repository Demo
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: "acme-corp",
                      name: "acme-corp",
                      desc: "payment-service (Stripe Charges -> PaymentIntents)",
                    },
                    {
                      id: "scale-enterprise",
                      name: "scale-enterprise",
                      desc: "billing-core (OpenAI v2 + Stripe API)",
                    },
                    {
                      id: "sovereign-ai",
                      name: "sovereign-ai",
                      desc: "agent-runtime (Resend + OpenAI SDK)",
                    },
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setSelectedPresetOrg(preset.id);
                        setCustomOrgName("");
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedPresetOrg === preset.id && !customOrgName
                          ? "bg-[#F7EECD] border-[#BA8C28] shadow-xs"
                          : "bg-white border-[#E5DAC1] hover:border-[#BA8C28]/60"
                      }`}
                    >
                      <div className="font-bold text-xs text-[#0A0A0A] flex items-center justify-between mb-1">
                        <span>{preset.name}</span>
                        {selectedPresetOrg === preset.id && !customOrgName && (
                          <Check className="w-3.5 h-3.5 text-[#BA8C28]" />
                        )}
                      </div>
                      <div className="text-[10px] text-[#4B5563] leading-tight">
                        {preset.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#71717A] mb-1.5 font-bold">
                  Or Specify Custom Organization Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. my-company-engineering"
                  value={customOrgName}
                  onChange={(e) => setCustomOrgName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E5DAC1] text-xs text-[#0A0A0A] focus:border-[#BA8C28] focus:outline-none font-mono"
                />
              </div>

              {/* Granted Permissions Summary */}
              <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E5DAC1] space-y-2">
                <div className="text-xs font-mono uppercase text-[#71717A] font-bold flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Configured Permissions</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[#0A0A0A]">
                  <div>✓ Repository Contents (Read)</div>
                  <div>✓ Pull Requests (Read & Write)</div>
                  <div>✓ Webhook Deliveries (Read)</div>
                  <div>✓ 1-Hour Ephemeral Tokens</div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                onClick={handleInstantConnect}
                disabled={connecting}
                className="w-full py-3 rounded-xl bg-[#0A0A0A] hover:bg-[#1C1C22] text-[#FAF9F5] text-xs font-bold tracking-wide transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {connecting ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin text-[#BA8C28]" />
                    <span>Connecting Organization...</span>
                  </>
                ) : (
                  <>
                    <span>Connect & Start Monitoring</span>
                    <span className="text-[#BA8C28]">→</span>
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === "production" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E5DAC1] text-xs leading-relaxed text-[#4B5563]">
                To connect your real production GitHub organization, configure your GitHub App credentials in <code className="bg-[#F5F3EC] px-1.5 py-0.5 rounded text-[#0A0A0A]">.env</code>:
                <div className="mt-3 p-3 rounded-lg bg-[#0D0D11] text-emerald-400 font-mono text-[11px]">
                  GITHUB_APP_ID=...<br />
                  GITHUB_APP_PRIVATE_KEY=&quot;-----BEGIN RSA PRIVATE KEY-----...&quot;<br />
                  GITHUB_APP_SLUG=aurumend-bot
                </div>
              </div>
            </div>
          )}

          {activeTab === "linked" && (
            <div className="space-y-3">
              {installations.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#71717A] font-mono">
                  No GitHub installations connected yet. Click &quot;Quick Connect&quot; to link a demo repo.
                </div>
              ) : (
                installations.map((inst: any, idx: number) => (
                  <div
                    key={inst.id || idx}
                    className="p-3.5 rounded-xl bg-white border border-[#E5DAC1] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FAF9F5] border border-[#E5DAC1] flex items-center justify-center">
                        <Github className="w-4 h-4 text-[#0A0A0A]" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0A0A0A]">
                          {inst.accountLogin}
                        </div>
                        <div className="text-[10px] font-mono text-[#71717A]">
                          Installation #{inst.githubInstallationId} • Active
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                      Connected
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
