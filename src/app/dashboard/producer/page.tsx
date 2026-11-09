"use client";

import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProducerView from "@/components/dashboard/ProducerView";
import ApiKeyModal from "@/components/dashboard/ApiKeyModal";
import Footer from "@/components/landing/Footer";
import { useRouter } from "next/navigation";

export default function ProducerDashboardPage() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<any>({
    org: null,
    installations: [],
    vendorReleases: [],
    apiKeys: [],
  });
  const [keyModalOpen, setKeyModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/v1/dashboard/data");
      const data = await res.json();
      if (data && !data.error) {
        setDashboardData(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-[#070709] text-[#FAF9F6] selection:bg-[#D4AF37]/30 selection:text-[#F3E5AB] flex flex-col justify-between">
      <div>
        <DashboardHeader
          currentMode="producer"
          onModeChange={(mode) => {
            if (mode === "consumer") router.push("/dashboard");
          }}
          orgName={dashboardData.org?.name || "Aurumend Sovereign Corp"}
          orgSlug={dashboardData.org?.slug || "aurumend-corp"}
          onOpenKeyModal={() => setKeyModalOpen(true)}
          installationsCount={dashboardData.installations?.length || 0}
        />

        <main className="max-w-7xl mx-auto px-6 py-10">
          <ProducerView
            vendorReleases={dashboardData.vendorReleases}
            onRefreshData={fetchDashboardData}
          />
        </main>
      </div>

      <ApiKeyModal
        isOpen={keyModalOpen}
        onClose={() => setKeyModalOpen(false)}
        keys={dashboardData.apiKeys || []}
        onKeyCreated={fetchDashboardData}
      />

      <Footer />
    </div>
  );
}
