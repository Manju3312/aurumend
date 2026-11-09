import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { executeAutonomousMigration } from "@/lib/autonomous-migration";
import { db } from "@/db";
import { vendorApiReleases, repoApiSubscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json().catch(() => ({}));
    let { vendorReleaseId, subscriptionId } = body;

    // If IDs not provided, auto-discover first active release and subscription
    if (!vendorReleaseId) {
      let release = await db.query.vendorApiReleases.findFirst();
      if (!release) {
        // Seed initial release for Stripe v2025-04
        const [newRelease] = await db
          .insert(vendorApiReleases)
          .values({
            vendorOrgId: session.orgId,
            vendorSlug: "stripe",
            versionTag: "v2025-04-01",
            openapiSpecJson: {
              openapi: "3.0.0",
              info: { title: "Stripe API", version: "2025-04-01" },
              paths: { "/v1/payment_intents": { post: { summary: "Create PaymentIntent" } } },
            },
            migrationManifestJson: {
              breaking_change_summary: "Deprecated charges.create; migrated to paymentIntents.create",
              sunset_date: "2026-06-30T23:59:59Z",
              ast_search_patterns: [],
              transformation_instructions: [],
              contract_test_fixtures: [],
            },
            breakingChangeSummary: "Deprecated charges.create; migrated to paymentIntents.create",
          })
          .returning();
        release = newRelease;
      }
      vendorReleaseId = release.id;
    }

    if (!subscriptionId) {
      let sub = await db.query.repoApiSubscriptions.findFirst({
        where: eq(repoApiSubscriptions.consumerOrgId, session.orgId),
      });

      if (!sub) {
        const [newSub] = await db
          .insert(repoApiSubscriptions)
          .values({
            consumerOrgId: session.orgId,
            githubInstallationId: BigInt(87654321),
            repoFullName: "acme-corp/payment-service",
            vendorSlug: "stripe",
            affectedFilePaths: [
              { path: "src/services/payment.ts", lines: [9, 15] },
              { path: "src/app/api/webhooks/stripe/route.ts", lines: [10, 16] },
            ],
            lastScannedSha: "sha_head",
          })
          .returning();
        sub = newSub;
      }
      subscriptionId = sub.id;
    }

    const result = await executeAutonomousMigration({
      vendorReleaseId,
      subscriptionId,
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    console.error("[Migration Execute Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

