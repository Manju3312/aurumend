import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, getOrCreateDefaultOrg, SessionUser } from "@/lib/auth";
import { db } from "@/db";
import { organizations, orgMemberships } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = body.email || "architect@aurumend.io";
    const name = body.name || "Sovereign Architect";
    const githubUsername = body.githubUsername || "aurumend-admin";
    const roleMode = body.roleMode || "hybrid";

    const { org, membership } = await getOrCreateDefaultOrg();

    if (roleMode && org.roleMode !== roleMode) {
      await db
        .update(organizations)
        .set({ roleMode, updatedAt: new Date() })
        .where(eq(organizations.id, org.id));
    }

    const sessionUser: SessionUser = {
      userId: membership.externalUserId,
      email,
      name,
      githubUsername,
      orgId: org.id,
      orgSlug: org.slug,
      role: membership.role,
      roleMode,
    };

    const token = createSessionToken(sessionUser);

    const response = NextResponse.json({ success: true, user: sessionUser });
    response.cookies.set("aurumend_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

