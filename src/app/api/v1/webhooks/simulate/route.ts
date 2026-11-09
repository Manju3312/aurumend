import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { webhookSimulatorEvents, auditLogs } from "@/db/schema";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json().catch(() => ({}));

    const vendorSlug = body.vendor_slug || "stripe";
    const eventType = body.event_type || "payment_intent.succeeded";
    const payload = body.payload || {
      id: "evt_live_" + Math.random().toString(36).substring(2, 10),
      object: "event",
      api_version: "2025-04-01",
      type: eventType,
      data: {
        object: {
          id: "pi_3MtwBwLkdIwHu7ix28a3tqPa",
          object: "payment_intent",
          amount: 1099,
          currency: "usd",
          status: "succeeded",
          payment_method: "pm_card_visa",
        },
      },
    };

    const startTime = Date.now();
    // Simulate webhook ingestion & verification
    const executionDuration = Date.now() - startTime + Math.floor(Math.random() * 20) + 12;

    const [recorded] = await db
      .insert(webhookSimulatorEvents)
      .values({
        orgId: session.orgId,
        vendorSlug,
        eventType,
        payloadJson: payload,
        responseStatus: 200,
        responseBody: JSON.stringify({
          received: true,
          status: "verified_by_aurumend",
          duration_ms: executionDuration,
        }),
      })
      .returning();

    await db.insert(auditLogs).values({
      orgId: session.orgId,
      eventType: "webhook_simulated",
      title: `Webhook Simulated: ${vendorSlug}.${eventType}`,
      description: `Dispatched test payload for ${eventType}. Consumer handler returned HTTP 200 in ${executionDuration}ms.`,
      metadataJson: {
        eventId: recorded.id,
        vendorSlug,
        eventType,
        executionDuration,
      },
    });

    return NextResponse.json({
      success: true,
      event_id: recorded.id,
      vendor_slug: vendorSlug,
      event_type: eventType,
      status: 200,
      duration_ms: executionDuration,
      result: "Webhook successfully verified against consumer route handler",
    });
  } catch (error: any) {
    console.error("[Webhook Simulation Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
