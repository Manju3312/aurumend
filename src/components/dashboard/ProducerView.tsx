"use client";

import React, { useState } from "react";
import {
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  GitCompare,
} from "lucide-react";

interface ProducerViewProps {
  vendorReleases: any[];
  onRefreshData: () => void;
}

export default function ProducerView({
  vendorReleases,
  onRefreshData,
}: ProducerViewProps) {
  const [vendorSlug, setVendorSlug] = useState("stripe");
  const [versionTag, setVersionTag] = useState("v2025-04-01");
  const [releaseNotes, setReleaseNotes] = useState(
    "Deprecated legacy charges.create endpoint. All new integrations must use payment_intents with automatic payment methods."
  );
  const [prevSpec, setPrevSpec] = useState(
    JSON.stringify(
      {
        openapi: "3.0.0",
        info: { title: "Stripe API", version: "2023-10-16" },
        paths: {
          "/v1/charges": {
            post: {
              summary: "Create Charge",
              requestBody: {
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: { amount: { type: "integer" }, source: { type: "string" } },
                    },
                  },
                },
              },
            },
          },
        },
      },
      null,
      2
    )
  );
  const [newSpec, setNewSpec] = useState(
    JSON.stringify(
      {
        openapi: "3.0.0",
        info: { title: "Stripe API", version: "2025-04-01" },
        paths: {
          "/v1/payment_intents": {
            post: {
              summary: "Create Payment Intent",
              requestBody: {
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        amount: { type: "integer" },
                        payment_method: { type: "string" },
                        confirm: { type: "boolean" },
                      },
                      required: ["amount", "payment_method"],
                    },
                  },
                },
              },
            },
          },
        },
      },
      null,
      2
    )
  );

  const [publishing, setPublishing] = useState(false);
  const [comparing, setComparing] = useState(false);
  const [diffResult, setDiffResult] = useState<any>(null);
  const [publishResult, setPublishResult] = useState<any>(null);

  const handleCompareSpecs = async () => {
    setComparing(true);
    setDiffResult(null);
    try {
      const res = await fetch("/api/v1/specs/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prev_spec: JSON.parse(prevSpec),
          new_spec: JSON.parse(newSpec),
        }),
      });
      const data = await res.json();
      setDiffResult(data);
    } catch (err: any) {
      alert("Spec Comparison Error: " + err.message);
    } finally {
      setComparing(false);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishing(true);
    setPublishResult(null);

    try {
      const res = await fetch("/api/v1/releases/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendor_slug: vendorSlug,
          version_tag: versionTag,
          prev_spec: JSON.parse(prevSpec),
          new_spec: JSON.parse(newSpec),
          release_notes: releaseNotes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPublishResult(data);
        onRefreshData();
      }
    } catch (err: any) {
      console.error(err);
      alert("Publish failed: " + err.message);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Telemetry & Adoption Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-[#E5DAC1] shadow-xs">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717A] mb-1 font-bold">
            Customer Adoption Rate
          </div>
          <div className="font-sans text-3xl font-black text-[#0A0A0A]">82.4%</div>
          <p className="text-xs text-emerald-700 mt-1 font-mono font-semibold">
            +38% faster than manual migrations
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E5DAC1] shadow-xs">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717A] mb-1 font-bold">
            Subscribed Repositories
          </div>
          <div className="font-sans text-3xl font-black text-[#0A0A0A]">842 Repos</div>
          <p className="text-xs text-[#8C6515] mt-1 font-mono font-semibold">
            Across 148 Organizations
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E5DAC1] shadow-xs">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717A] mb-1 font-bold">
            Verified PRs Delivered
          </div>
          <div className="font-sans text-3xl font-black text-[#0A0A0A]">712 PRs</div>
          <p className="text-xs text-emerald-700 mt-1 font-mono font-semibold">
            100% Sandbox Contract Passed
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E5DAC1] shadow-xs">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717A] mb-1 font-bold">
            Dev Hours Saved
          </div>
          <div className="font-sans text-3xl font-black text-[#0A0A0A]">3,560 Hrs</div>
          <p className="text-xs text-[#71717A] mt-1 font-mono">
            Zero customer churn
          </p>
        </div>
      </div>

      {/* Success Banner */}
      {publishResult && (
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 font-mono text-xs text-emerald-800 space-y-2 animate-fade-in shadow-xs">
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-700">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>
              Release {publishResult.vendor_slug}@{publishResult.version_tag} Published & Dispatched!
            </span>
          </div>
          <div>Breaking changes detected: <strong>{publishResult.breaking_changes_detected}</strong></div>
          <div>Customer repositories notified: <strong>{publishResult.subscribers_notified}</strong></div>
          <div>Autonomous verified migration PRs enqueued: <strong>{publishResult.enqueued_migration_prs.length}</strong></div>
        </div>
      )}

      {/* OpenAPI Spec Publisher Form */}
      <div className="rounded-2xl bg-white border border-[#E5DAC1] shadow-xs p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#E5DAC1] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0A0A0A] border border-[#BA8C28]/40 flex items-center justify-center">
              <UploadCloud className="w-4 h-4 text-[#BA8C28]" />
            </div>
            <div>
              <h3 className="font-sans text-lg font-bold text-[#0A0A0A]">
                Publish New OpenAPI Spec Release
              </h3>
              <p className="text-xs text-[#4B5563]">
                Diffs specifications with OASDiff, synthesizes deterministic manifests, and auto-opens tested PRs
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCompareSpecs}
            disabled={comparing}
            className="px-4 py-2 rounded-lg bg-white hover:bg-[#FAF9F5] border border-[#DFD2B5] text-xs font-semibold text-[#0A0A0A] transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            {comparing ? (
              <RotateCw className="w-3.5 h-3.5 animate-spin text-[#BA8C28]" />
            ) : (
              <GitCompare className="w-3.5 h-3.5 text-[#BA8C28]" />
            )}
            <span>Preview OASDiff</span>
          </button>
        </div>

        <form onSubmit={handlePublish} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#71717A] mb-1 font-bold">
                Vendor Identifier (Slug)
              </label>
              <input
                type="text"
                value={vendorSlug}
                onChange={(e) => setVendorSlug(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#E5DAC1] text-xs text-[#0A0A0A] font-mono focus:border-[#BA8C28] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-[#71717A] mb-1 font-bold">
                Version Tag
              </label>
              <input
                type="text"
                value={versionTag}
                onChange={(e) => setVersionTag(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#E5DAC1] text-xs text-[#0A0A0A] font-mono focus:border-[#BA8C28] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#71717A] mb-1 font-bold">
              Release Notes & Breaking Changes Summary
            </label>
            <textarea
              rows={2}
              value={releaseNotes}
              onChange={(e) => setReleaseNotes(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#E5DAC1] text-xs text-[#0A0A0A] font-mono focus:border-[#BA8C28] focus:outline-none"
            />
          </div>

          {/* Side by side OpenAPI specs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase text-[#71717A] mb-1 font-bold">
                Previous Version Spec (JSON)
              </label>
              <textarea
                rows={10}
                value={prevSpec}
                onChange={(e) => setPrevSpec(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#0D0D11] border border-[#E5DAC1]/50 text-xs text-[#FAF9F5] font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-[#71717A] mb-1 font-bold">
                New Breaking Version Spec (JSON)
              </label>
              <textarea
                rows={10}
                value={newSpec}
                onChange={(e) => setNewSpec(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#0D0D11] border border-[#E5DAC1]/50 text-xs text-[#FAF9F5] font-mono focus:outline-none"
              />
            </div>
          </div>

          {/* Diff Result Box */}
          {diffResult && (
            <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E5DAC1] font-mono text-xs space-y-2">
              <div className="text-xs font-bold text-[#0A0A0A] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#BA8C28]" />
                <span>OASDiff Identified {diffResult.breaking_count} Breaking Alterations</span>
              </div>
              <div className="text-[11px] text-[#4B5563]">
                {diffResult.diff_summary}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={publishing}
              className="px-6 py-3 rounded-xl bg-[#0A0A0A] hover:bg-[#1C1C22] text-[#FAF9F5] text-xs font-bold tracking-wide transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              {publishing ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin text-[#BA8C28]" />
                  <span>Synthesizing Manifest & Dispatched PRs...</span>
                </>
              ) : (
                <>
                  <span>Publish Release & Auto-Dispatch PRs</span>
                  <span className="text-[#BA8C28]">→</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
