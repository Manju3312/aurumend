"use client";

import React, { useState } from "react";
import { Calculator, ArrowRight, Sparkles, Shield, Clock, DollarSign } from "lucide-react";
import Link from "next/link";

export default function RoiCalculator() {
  const [apiCount, setApiCount] = useState<number>(6);
  const [repoCount, setRepoCount] = useState<number>(4);

  // Calculations
  const hoursSavedPerYear = apiCount * repoCount * 18; // ~18 hours per breaking migration per repo
  const estimatedCostSaved = hoursSavedPerYear * 110; // $110/hr blended engineering cost
  const incidentsPrevented = Math.round(apiCount * 1.6);

  return (
    <section id="roi-calculator" className="py-20 px-6 max-w-5xl mx-auto relative z-10">
      <div className="rounded-3xl bg-gradient-to-br from-[#111116] via-[#14141f] to-[#1a1a26] border border-[#D4AF37]/30 p-8 sm:p-12 shadow-2xl">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#F3E5AB] text-xs font-mono mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Protocol ROI Engine</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FAF9F6]">
            Calculate Your Organization&apos;s <span className="gold-text-gradient">Immunity ROI</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-2">
            See how much engineering capacity Aurumend liberates by eliminating manual migration toil.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Sliders */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-[#A1A1AA] uppercase">External Vendor APIs Consumed:</span>
                <span className="text-[#F3E5AB] font-bold text-sm">{apiCount} APIs</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                value={apiCount}
                onChange={(e) => setApiCount(parseInt(e.target.value, 10))}
                className="w-full accent-[#D4AF37] h-2 bg-black/60 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
                <span>1 (Stripe only)</span>
                <span>12 (Mid-market)</span>
                <span>25+ (Enterprise)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-[#A1A1AA] uppercase">Connected Microservices & Repos:</span>
                <span className="text-[#D4AF37] font-bold text-sm">{repoCount} Repositories</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={repoCount}
                onChange={(e) => setRepoCount(parseInt(e.target.value, 10))}
                className="w-full accent-[#D4AF37] h-2 bg-black/60 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
                <span>1 Repo</span>
                <span>10 Repos</span>
                <span>20+ Repos</span>
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="grid grid-cols-2 gap-4 p-6 rounded-2xl bg-[#070709] border border-white/10 text-center font-mono">
            <div className="p-4 rounded-xl bg-[#111116] border border-white/5">
              <Clock className="w-5 h-5 text-[#F3E5AB] mx-auto mb-1.5" />
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF9F6]">
                {hoursSavedPerYear.toLocaleString()}
              </div>
              <div className="text-[10px] text-[#A1A1AA] uppercase mt-1">
                Eng Hours Liberated / Yr
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#111116] border border-white/5">
              <DollarSign className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
              <div className="font-serif text-2xl sm:text-3xl font-bold text-emerald-400">
                ${estimatedCostSaved.toLocaleString()}
              </div>
              <div className="text-[10px] text-[#A1A1AA] uppercase mt-1">
                Engineering Cost Saved
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#111116] border border-white/5 col-span-2">
              <Shield className="w-5 h-5 text-[#D4AF37] mx-auto mb-1.5" />
              <div className="font-serif text-xl sm:text-2xl font-bold text-[#F3E5AB]">
                {incidentsPrevented} Breaking Deprecations Autonomously Healed
              </div>
              <div className="text-[10px] text-[#A1A1AA] uppercase mt-1">
                Zero Production Incident Panic Calls
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#996515] text-[#070709] text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all shadow-xl"
          >
            <span>Deploy Aurumend to Your Repositories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
