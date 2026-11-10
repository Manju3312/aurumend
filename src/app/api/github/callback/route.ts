import { NextRequest, NextResponse } from "next/server";
import { verifyInstallState } from "@/lib/auth";
import { db } from "@/db";
import { githubInstallations, organizations, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getInstallationOctokit } from "@/lib/github-auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const installationIdStr = searchParams.get("installation_id");
    const stateToken = searchParams.get("state");
    const setupAction = searchParams.get("setup_action");
    const accountParam = searchParams.get("account");

    if (!installationIdStr) {
      return NextResponse.json(
        { error: "Missing installation_id parameter" },
        { status: 400 }
      );
    }

    const installationId = BigInt(installationIdStr);

    let orgId: string | null = null;
    if (stateToken) {
      try {
        const payload = verifyInstallState(stateToken);
        orgId = payload.orgId;
      } catch (err) {
        console.warn("[GitHub Callback] Invalid state token, attempting fallback to first org", err);
      }
    }

    if (!orgId) {
      const firstOrg = await db.query.organizations.findFirst();
      if (!firstOrg) {
        return NextResponse.json(
          { error: "No organization found to attach GitHub installation" },
          { status: 404 }
        );
      }
      orgId = firstOrg.id;
    }

    // Attempt to query GitHub for the account login, or use fallback
    let accountLogin = accountParam || "acme-corp";
    const { octokit, simulated } = await getInstallationOctokit(installationId);
    if (!simulated) {
      try {
        const { data: installationData } = await octokit.rest.apps.getInstallation({
          installation_id: Number(installationId),
        });
        if (installationData.account && "login" in installationData.account) {
          accountLogin = installationData.account.login;
        }
      } catch (err) {
        console.warn("[GitHub Callback] Could not read installation from GitHub", err);
      }
    }

    // Upsert installation in DB
    const existing = await db.query.githubInstallations.findFirst({
      where: eq(githubInstallations.githubInstallationId, installationId),
    });

    if (existing) {
      await db
        .update(githubInstallations)
        .set({
          orgId,
          accountLogin,
          status: "active",
          updatedAt: new Date(),
        })
        .where(eq(githubInstallations.id, existing.id));
    } else {
      await db.insert(githubInstallations).values({
        orgId,
        githubInstallationId: installationId,
        accountLogin,
        status: "active",
      });
    }

    // Record Sovereign Audit Log
    try {
      await db.insert(auditLogs).values({
        orgId,
        eventType: "github_installed",
        title: `GitHub App Connected: ${accountLogin}`,
        description: `Installation #${installationIdStr} linked to Aurumend Sovereign Protocol. JIT tokens and repo webhooks active.`,
        metadataJson: {
          installationId: installationIdStr,
          account: accountLogin,
          setupAction: setupAction || "install",
        },
      });
    } catch (auditErr) {
      console.warn("[Audit Log insertion warning]", auditErr);
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(
      `${baseUrl}/dashboard?installed=true&account=${encodeURIComponent(
        accountLogin
      )}&installation_id=${installationIdStr}`
    );
  } catch (error: any) {
    console.error("[GitHub Callback Error]:", error);
    return NextResponse.json(
      { error: "Failed to process GitHub App callback", details: error.message },
      { status: 500 }
    );
  }
}

