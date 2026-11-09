import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import {
  organizations,
  githubInstallations,
  repoApiSubscriptions,
  vendorApiReleases,
  migrationPullRequests,
  apiKeys,
} from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    // 1. Fetch Organization Details
    const org = await db.query.organizations.findFirst({
      where: eq(organizations.id, session.orgId),
    });

    // 2. Fetch GitHub Installations
    const rawInstallations = await db.query.githubInstallations.findMany({
      where: eq(githubInstallations.orgId, session.orgId),
    });

    const installations = rawInstallations.map((inst) => ({
      ...inst,
      githubInstallationId: inst.githubInstallationId.toString(),
    }));

    // 3. Fetch Subscriptions (Consumer)
    const rawSubscriptions = await db.query.repoApiSubscriptions.findMany({
      where: eq(repoApiSubscriptions.consumerOrgId, session.orgId),
      orderBy: [desc(repoApiSubscriptions.createdAt)],
    });

    const subscriptions = rawSubscriptions.map((sub) => ({
      ...sub,
      githubInstallationId: sub.githubInstallationId.toString(),
    }));

    // 4. Fetch Migration PRs
    const rawPrs = await db.query.migrationPullRequests.findMany({
      where: eq(migrationPullRequests.consumerOrgId, session.orgId),
      orderBy: [desc(migrationPullRequests.createdAt)],
      with: {
        vendorRelease: true,
        subscription: true,
      },
    });

    const prs = rawPrs.map((pr) => ({
      ...pr,
      subscription: pr.subscription
        ? {
            ...pr.subscription,
            githubInstallationId: pr.subscription.githubInstallationId.toString(),
          }
        : null,
    }));

    // 5. Fetch Vendor Releases (Producer)
    const releases = await db.query.vendorApiReleases.findMany({
      where: eq(vendorApiReleases.vendorOrgId, session.orgId),
      orderBy: [desc(vendorApiReleases.publishedAt)],
    });

    // 6. Fetch API Keys
    const keys = await db.query.apiKeys.findMany({
      where: eq(apiKeys.orgId, session.orgId),
      orderBy: [desc(apiKeys.createdAt)],
    });

    return NextResponse.json({
      session,
      org,
      installations,
      subscriptions,
      migrationPullRequests: prs,
      vendorReleases: releases,
      apiKeys: keys.map((k) => ({
        id: k.id,
        name: k.name,
        keyPrefix: k.keyPrefix,
        scopes: k.scopes,
        lastUsedAt: k.lastUsedAt,
        createdAt: k.createdAt,
      })),
    });
  } catch (error: any) {
    console.error("[Dashboard Data Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
