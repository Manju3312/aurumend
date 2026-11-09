import { NextRequest, NextResponse } from "next/server";
import { validateBearerApiKey } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const validation = await validateBearerApiKey(authHeader);

  if (!validation.valid || !validation.apiKey || !validation.organization) {
    return NextResponse.json(
      { error: validation.error || "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    key_prefix: validation.apiKey.keyPrefix,
    scopes: validation.apiKey.scopes,
    organization: {
      id: validation.organization.id,
      name: validation.organization.name,
      slug: validation.organization.slug,
      role_mode: validation.organization.roleMode,
    },
  });
}

export async function POST(req: NextRequest) {
  // Alias for CLI ping / validation checks
  return GET(req);
}
