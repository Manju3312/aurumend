import { NextRequest, NextResponse } from "next/server";
import { getSession, generateApiKey } from "@/lib/auth";
import { db } from "@/db";
import { apiKeys } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getSession();
    const keys = await db.query.apiKeys.findMany({
      where: eq(apiKeys.orgId, session.orgId),
      orderBy: [desc(apiKeys.createdAt)],
    });

    const safeKeys = keys.map((k) => ({
      id: k.id,
      name: k.name,
      keyPrefix: k.keyPrefix,
      scopes: k.scopes,
      lastUsedAt: k.lastUsedAt,
      createdAt: k.createdAt,
    }));

    return NextResponse.json({ keys: safeKeys });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json().catch(() => ({}));
    const keyName = body.name || "CI/CD Release Publisher";
    const scopes = body.scopes || ["releases:write", "specs:read"];

    const { rawKey, keyPrefix, keyHash } = generateApiKey();

    const [created] = await db
      .insert(apiKeys)
      .values({
        orgId: session.orgId,
        name: keyName,
        keyPrefix,
        keyHash,
        scopes,
      })
      .returning();

    return NextResponse.json({
      message: "API key created successfully. Save this raw key; it will never be displayed again.",
      apiKey: {
        id: created.id,
        name: created.name,
        rawKey, // Shown only once upon creation
        keyPrefix: created.keyPrefix,
        scopes: created.scopes,
        createdAt: created.createdAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

