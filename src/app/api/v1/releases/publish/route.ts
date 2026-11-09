import { NextRequest, NextResponse } from "next/server";
import { validateBearerApiKey, getSession } from "@/lib/auth";
import { computeOpenApiDiff } from "@/lib/openapi-diff";
import { generateMigrationManifest } from "@/lib/manifest-generator";
import { db } from "@/db";
import { vendorApiReleases, repoApiSubscriptions, migrationPullRequests } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate via Bearer API Key or Session Cookie
    const authHeader = req.headers.get("authorization");
    let vendorOrgId: string;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const validation = await validateBearerApiKey(authHeader);
      if (!validation.valid || !validation.organization) {
        return NextResponse.json(
          { error: validation.error || "Invalid API key" },
          { status: 401 }
        );
      }
      vendorOrgId = validation.organization.id;
    } else {
      const session = await getSession();
      vendorOrgId = session.orgId;
    }

    // 2. Parse request payload
    let body: any;
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      body = await req.json();
    } else if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      const prevSpecStr = formData.get("prev_spec") as string;
      const newSpecStr = formData.get("new_spec") as string;
      body = {
        vendor_slug: formData.get("vendor_slug"),
        version_tag: formData.get("version_tag"),
        prev_spec: prevSpecStr ? JSON.parse(prevSpecStr) : {},
        new_spec: newSpecStr ? JSON.parse(newSpecStr) : {},
        release_notes: formData.get("release_notes") || "",
      };
    } else {
      return NextResponse.json(
        { error: "Unsupported Content-Type. Please send JSON or multipart/form-data." },
        { status: 400 }
      );
    }

    const { vendor_slug, version_tag, prev_spec, new_spec, release_notes } = body;

    if (!vendor_slug || !version_tag || !new_spec) {
      return NextResponse.json(
        {
          error: "Missing required fields: 'vendor_slug', 'version_tag', and 'new_spec' are required.",
        },
        { status: 400 }
      );
    }

    // 3. Programmatic Spec Diffing
    const diff = computeOpenApiDiff(prev_spec || {}, new_spec);

    // 4. Generate Migration Manifest via Claude Sonnet Structured Output
    const manifest = await generateMigrationManifest({
      vendorSlug: vendor_slug,
      versionTag: version_tag,
      prevSpec: prev_spec || {},
      newSpec: new_spec,
      diff,
      releaseNotes: release_notes,
    });

    // 5. Persist to vendor_api_releases table
    const [release] = await db
      .insert(vendorApiReleases)
      .values({
        vendorOrgId,
        vendorSlug: vendor_slug,
        versionTag: version_tag,
        openapiSpecJson: new_spec,
        migrationManifestJson: manifest,
        breakingChangeSummary: manifest.breaking_change_summary,
      })
      .returning();

    // 6. Find affected subscriber repositories
    const subscribers = await db.query.repoApiSubscriptions.findMany({
      where: eq(repoApiSubscriptions.vendorSlug, vendor_slug),
    });

    // 7. Enqueue initial migration pull request records
    const enqueuedPrs = [];
    for (const sub of subscribers) {
      const [prRecord] = await db
        .insert(migrationPullRequests)
        .values({
          subscriptionId: sub.id,
          consumerOrgId: sub.consumerOrgId,
          vendorReleaseId: release.id,
          status: "testing",
          branchName: `aurumend/migrate-${vendor_slug}-${version_tag.replace(/[^a-zA-Z0-9-]/g, "-")}`,
          diffSummary: manifest.breaking_change_summary,
        })
        .returning();

      enqueuedPrs.push({
        repoFullName: sub.repoFullName,
        migrationPrId: prRecord.id,
        status: "testing",
      });
    }

    return NextResponse.json({
      success: true,
      release_id: release.id,
      vendor_slug: release.vendorSlug,
      version_tag: release.versionTag,
      breaking_changes_detected: diff.totalBreakingChanges,
      migration_manifest: manifest,
      subscribers_notified: subscribers.length,
      enqueued_migration_prs: enqueuedPrs,
    });
  } catch (error: any) {
    console.error("[Release Publish Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

