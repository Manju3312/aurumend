import { NextRequest, NextResponse } from "next/server";
import { getSession, signInstallState } from "@/lib/auth";
import { isGitHubAppLive } from "@/lib/github-auth";

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

    const isLiveConfigured = isGitHubAppLive();

    const accountParam = searchParams.get("account") || "acme-corp";
    const requestedAppSlug = searchParams.get("app_slug") || process.env.NEXT_PUBLIC_GITHUB_APP_SLUG || process.env.GITHUB_APP_SLUG;

    const forceLive = searchParams.get("live") === "true";
    const slugLooksRegistered = Boolean(requestedAppSlug && requestedAppSlug !== "aurumend-bot");

    // Real app credentials always install on GitHub, including the default slug once the app exists.
    // Without credentials, only an explicit non-placeholder slug is sent to github.com.
    if (requestedAppSlug && (isLiveConfigured || (forceLive && slugLooksRegistered))) {
      const installUrl = `https://github.com/apps/${requestedAppSlug}/installations/new?state=${encodeURIComponent(
        stateToken
      )}`;
      return NextResponse.redirect(installUrl);
    }

    // In local development or when live GitHub App is not registered on github.com:
    // Seamlessly complete the installation handshake using the callback endpoint!
    const simulatedInstallationId = Math.floor(10000000 + Math.random() * 90000000).toString();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const callbackUrl = `${baseUrl}/api/github/callback?installation_id=${simulatedInstallationId}&account=${encodeURIComponent(accountParam)}&state=${encodeURIComponent(
      stateToken
    )}&setup_action=install`;

    return NextResponse.redirect(callbackUrl);
  } catch (error: any) {
    console.error("[GitHub Install Error]:", error);
    return NextResponse.json(
      { error: "Failed to initiate GitHub App installation", details: error.message },
      { status: 500 }
    );
  }
}
