"use client";

import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ConsumerView from "@/components/dashboard/ConsumerView";
import ProducerView from "@/components/dashboard/ProducerView";
import SandboxLogModal from "@/components/dashboard/SandboxLogModal";
import ApiKeyModal from "@/components/dashboard/ApiKeyModal";
import Footer from "@/components/landing/Footer";

export default function DashboardPage() {
  const [currentMode, setCurrentMode] = useState<"consumer" | "producer">("consumer");
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>({
    session: null,
    org: null,
    installations: [],
    subscriptions: [],
    migrationPullRequests: [],
    vendorReleases: [],
    apiKeys: [],
  });

  // Modal States
  const [sandboxModalOpen, setSandboxModalOpen] = useState(false);
  const [sandboxLogs, setSandboxLogs] = useState("");
  const [sandboxRepo, setSandboxRepo] = useState("");
  const [sandboxBranch, setSandboxBranch] = useState("");
  const [keyModalOpen, setKeyModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/v1/dashboard/data");
      const data = await res.json();
      if (data && !data.error) {
        setDashboardData(data);
        if (data.org?.roleMode === "producer") {
          setCurrentMode("producer");
        }
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleOpenSandboxLogs = (logs: string, repo: string, branch: string) => {
    setSandboxLogs(logs);
    setSandboxRepo(repo);
    setSandboxBranch(branch);
    setSandboxModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-[#FAF9F6] selection:bg-[#D4AF37]/30 selection:text-[#F3E5AB] flex flex-col justify-between">
      <div>
        {/* Header with Role Mode Toggle */}
        <DashboardHeader
          currentMode={currentMode}
          onModeChange={setCurrentMode}
          orgName={dashboardData.org?.name || "Aurumend Sovereign Corp"}
          orgSlug={dashboardData.org?.slug || "aurumend-corp"}
          onOpenKeyModal={() => setKeyModalOpen(true)}
          installationsCount={dashboardData.installations?.length || 0}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-6 py-10">
          {currentMode === "consumer" ? (
            <ConsumerView
              subscriptions={dashboardData.subscriptions}
              migrationPrs={dashboardData.migrationPullRequests}
              onOpenSandboxModal={handleOpenSandboxLogs}
              onRefreshData={fetchDashboardData}
            />
          ) : (
            <ProducerView
              vendorReleases={dashboardData.vendorReleases}
              onRefreshData={fetchDashboardData}
            />
          )}
        </main>
      </div>

      {/* Sandbox Log Modal */}
      <SandboxLogModal
        isOpen={sandboxModalOpen}
        onClose={() => setSandboxModalOpen(false)}
        logs={sandboxLogs}
        repoFullName={sandboxRepo}
        branchName={sandboxBranch}
      />

      {/* API Key Modal */}
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

