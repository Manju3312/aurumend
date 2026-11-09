import { NextRequest, NextResponse } from "next/server";
import { getSession, signInstallState } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get("org_id") || session.orgId;

    const stateToken = signInstallState({
      orgId,
      userId: session.userId,
      timestamp: Date.now(),
    });

    const appSlug =
      process.env.NEXT_PUBLIC_GITHUB_APP_SLUG ||
      process.env.GITHUB_APP_SLUG ||
      "aurumend-bot";

    const installUrl = `https://github.com/apps/${appSlug}/installations/new?state=${encodeURIComponent(
      stateToken
    )}`;

    return NextResponse.redirect(installUrl);
  } catch (error: any) {
    console.error("[GitHub Install Error]:", error);
    return NextResponse.json(
      { error: "Failed to initiate GitHub App installation", details: error.message },
      { status: 500 }
    );
  }
}
