import { NextResponse } from "next/server";
import { pollUpstreamHarvesters, MONITORED_REGISTRY } from "@/lib/harvester";

export async function GET() {
  return NextResponse.json({
    success: true,
    totalMonitored: MONITORED_REGISTRY.length,
    targets: MONITORED_REGISTRY,
  });
}

export async function POST() {
  const result = await pollUpstreamHarvesters();
  return NextResponse.json({
    success: true,
    ...result,
  });
}

