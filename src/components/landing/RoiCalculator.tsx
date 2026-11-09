"use client";

import React, { useState } from "react";
import { Calculator, Shield, Clock, DollarSign } from "lucide-react";

export default function RoiCalculator() {
  const [apiCount, setApiCount] = useState<number>(6);
  const [repoCount, setRepoCount] = useState<number>(4);

  // Calculations: ~18 hours per breaking upgrade per repo (research, refactor, testing, PR review)
  const hoursSavedPerYear = apiCount * repoCount * 18;
  const estimatedCostSaved = hoursSavedPerYear * 110; // $110/hr blended engineering rate
  const incidentsPrevented = Math.round(apiCount * 1.6);

  return (
    <section id="roi-calculator" className="py-20 px-4 sm:px-6 max-w-5xl mx-auto relative z-10">
      <div className="rounded-2xl bg-white border border-[#E5DAC1] p-8 sm:p-12 shadow-xs">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F3EC] border border-[#E5DAC1] text-xs font-mono mb-3">
            <Calculator className="w-3.5 h-3.5 text-[#BA8C28]" />
            <span className="text-[#8C6515] font-bold">Engineering Capacity Calculator</span>
          </div>
          <h2 className="font-sans text-3xl sm:text-4xl font-black tracking-tight text-[#0A0A0A]">
            Estimate your annual <span className="text-[#BA8C28]">engineering hours saved</span>.
          </h2>
          <p className="text-xs sm:text-sm text-[#4B5563] mt-2 font-sans leading-relaxed">
            See how much engineering time your team saves by eliminating manual SDK migration toil and emergency sunset rollbacks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Sliders */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-[#4B5563] font-medium">External Vendor APIs Consumed:</span>
                <span className="text-[#BA8C28] font-bold text-sm">{apiCount} APIs</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                value={apiCount}
                onChange={(e) => setApiCount(parseInt(e.target.value, 10))}
                className="w-full accent-[#BA8C28] h-2 bg-[#F5F3EC] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#71717A] font-mono mt-1">
                <span>1 (Stripe only)</span>
                <span>8 (Average SaaS)</span>
                <span>25+ (Enterprise)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-[#4B5563] font-medium">Connected Repositories & Services:</span>
                <span className="text-[#BA8C28] font-bold text-sm">{repoCount} Repos</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={repoCount}
                onChange={(e) => setRepoCount(parseInt(e.target.value, 10))}
                className="w-full accent-[#BA8C28] h-2 bg-[#F5F3EC] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#71717A] font-mono mt-1">
                <span>1 Repo</span>
                <span>8 Repos</span>
                <span>20+ Repos</span>
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="grid grid-cols-2 gap-4 p-5 rounded-2xl bg-[#FAF9F5] border border-[#E5DAC1] text-center font-mono">
            <div className="p-4 rounded-xl bg-white border border-[#E5DAC1] shadow-xs">
              <Clock className="w-5 h-5 text-[#BA8C28] mx-auto mb-1.5" />
              <div className="font-sans text-2xl sm:text-3xl font-black text-[#0A0A0A]">
                {hoursSavedPerYear.toLocaleString()}
              </div>
              <div className="text-[10px] text-[#71717A] uppercase font-bold mt-1">
                Hours Liberated / Year
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E5DAC1] shadow-xs">
              <DollarSign className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
              <div className="font-sans text-2xl sm:text-3xl font-black text-emerald-700">
                ${estimatedCostSaved.toLocaleString()}
              </div>
              <div className="text-[10px] text-[#71717A] uppercase font-bold mt-1">
                Engineering Cost Saved
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E5DAC1] shadow-xs col-span-2">
              <Shield className="w-5 h-5 text-[#BA8C28] mx-auto mb-1.5" />
              <div className="font-sans text-xl sm:text-2xl font-black text-[#0A0A0A]">
                {incidentsPrevented} Breaking Incidents Prevented
              </div>
              <div className="text-[10px] text-[#71717A] uppercase font-bold mt-1">
                Estimated Production Drift Prevented Annually
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
