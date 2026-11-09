import { NextRequest, NextResponse } from "next/server";
import { computeOpenApiDiff } from "@/lib/openapi-diff";
import { generateMigrationManifest } from "@/lib/manifest-generator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { vendor_slug, version_tag, prev_spec, new_spec, release_notes } = body;

    if (!new_spec) {
      return NextResponse.json(
        { error: "Target OpenAPI spec ('new_spec') is required." },
        { status: 400 }
      );
    }

    const diff = computeOpenApiDiff(prev_spec || {}, new_spec);

    const manifest = await generateMigrationManifest({
      vendorSlug: vendor_slug || "custom-api",
      versionTag: version_tag || "v2.0.0",
      prevSpec: prev_spec || {},
      newSpec: new_spec,
      diff,
      releaseNotes: release_notes,
    });

    return NextResponse.json({
      success: true,
      diff,
      manifest,
    });
  } catch (error: any) {
    console.error("[Spec Compare Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
