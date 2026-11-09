"use client";

import React, { useState } from "react";
import { Calculator, ArrowRight, Shield, Clock, DollarSign } from "lucide-react";
import Link from "next/link";

export default function RoiCalculator() {
  const [apiCount, setApiCount] = useState<number>(6);
  const [repoCount, setRepoCount] = useState<number>(4);

  // Calculations: ~18 hours per breaking upgrade per repo (research, refactor, testing, PR review)
  const hoursSavedPerYear = apiCount * repoCount * 18;
  const estimatedCostSaved = hoursSavedPerYear * 110; // $110/hr blended engineering rate
  const incidentsPrevented = Math.round(apiCount * 1.6);

  return (
    <section id="roi-calculator" className="py-20 px-6 max-w-5xl mx-auto relative z-10">
      <div className="rounded-2xl dev-card p-8 sm:p-12 shadow-2xl">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono mb-3">
            <Calculator className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[#A1A1AA]">Engineering Capacity Calculator</span>
          </div>
          <h2 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight text-[#FAF9F6]">
            Estimate your annual <span className="text-amber-300">engineering hours saved</span>.
          </h2>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-2 font-sans leading-relaxed">
            See how much engineering time your team saves by eliminating manual SDK migration toil and emergency sunset rollbacks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Sliders */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-[#A1A1AA]">External Vendor APIs Consumed:</span>
                <span className="text-amber-300 font-bold text-sm">{apiCount} APIs</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                value={apiCount}
                onChange={(e) => setApiCount(parseInt(e.target.value, 10))}
                className="w-full accent-amber-400 h-2 bg-black/60 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
                <span>1 (Stripe only)</span>
                <span>8 (Average SaaS)</span>
                <span>25+ (Enterprise)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-[#A1A1AA]">Connected Repositories & Services:</span>
                <span className="text-amber-300 font-bold text-sm">{repoCount} Repos</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={repoCount}
                onChange={(e) => setRepoCount(parseInt(e.target.value, 10))}
                className="w-full accent-amber-400 h-2 bg-black/60 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
                <span>1 Repo</span>
                <span>8 Repos</span>
                <span>20+ Repos</span>
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="grid grid-cols-2 gap-4 p-5 rounded-2xl bg-[#09090d] border border-white/[0.06] text-center font-mono">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <Clock className="w-5 h-5 text-amber-300 mx-auto mb-1.5" />
              <div className="font-sans text-2xl sm:text-3xl font-bold text-[#FAF9F6]">
                {hoursSavedPerYear.toLocaleString()}
              </div>
              <div className="text-[10px] text-[#A1A1AA] uppercase mt-1">
                Hours Liberated / Year
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <DollarSign className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
              <div className="font-sans text-2xl sm:text-3xl font-bold text-emerald-400">
                ${estimatedCostSaved.toLocaleString()}
              </div>
              <div className="text-[10px] text-[#A1A1AA] uppercase mt-1">
                Engineering Cost Saved
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] col-span-2">
              <Shield className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
              <div className="font-sans text-xl sm:text-2xl font-bold text-[#FAF9F6]">
                {incidentsPrevented} Breaking Upgrades Autonomously Verified
              </div>
              <div className="text-[10px] text-[#A1A1AA] uppercase mt-1 font-sans">
                Zero production incident postmortems from decommissioned API versions
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#c29828] text-[#070709] text-xs font-semibold tracking-tight hover:brightness-110 transition-all shadow-md cursor-pointer"
          >
            <span>Scan Your Repositories for Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
