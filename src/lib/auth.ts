import crypto from "crypto";
import jwt from "jsonwebtoken";
import { db } from "@/db";
import { organizations, orgMemberships, apiKeys, Organization, OrgMembership } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "aurumend-sovereign-protocol-secret-key-2025";

export interface SessionUser {
  userId: string;
  email: string;
  name: string;
  githubUsername?: string;
  orgId: string;
  orgSlug: string;
  role: "admin" | "publisher" | "member";
  roleMode: "producer" | "consumer" | "hybrid";
}

export interface StatePayload {
  orgId: string;
  userId: string;
  timestamp: number;
}

/**
 * Signs a state JWT payload for CSRF protection during GitHub App installation.
 */
export function signInstallState(payload: StatePayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
}

/**
 * Verifies and decodes GitHub installation state.
 */
export function verifyInstallState(token: string): StatePayload {
  return jwt.verify(token, JWT_SECRET) as StatePayload;
}

/**
 * Generate a new Sovereign API Key (Format: aur_live_<48 hex chars>).
 * Returns the raw key (shown only once to user) and the SHA-256 hash (stored in DB).
 */
export function generateApiKey(): { rawKey: string; keyPrefix: string; keyHash: string } {
  const randomHex = crypto.randomBytes(24).toString("hex");
  const keyPrefix = "aur_live_";
  const rawKey = `${keyPrefix}${randomHex}`;
  const keyHash = hashApiKey(rawKey);
  return { rawKey, keyPrefix, keyHash };
}

/**
 * Hashes an API key using SHA-256.
 */
export function hashApiKey(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex");
}

/**
 * Validates a Bearer token from CLI / CI request against database.
 */
export async function validateBearerApiKey(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { valid: false, error: "Missing or malformed Authorization header" };
  }

  const rawKey = authHeader.replace("Bearer ", "").trim();
  if (!rawKey.startsWith("aur_live_")) {
    return { valid: false, error: "Invalid API key format" };
  }

  const keyHash = hashApiKey(rawKey);

  const foundKey = await db.query.apiKeys.findFirst({
    where: eq(apiKeys.keyHash, keyHash),
    with: {
      organization: true,
    },
  });

  if (!foundKey) {
    return { valid: false, error: "Invalid or revoked API key" };
  }

  // Update lastUsedAt asynchronously
  await db
    .update(apiKeys)
    .set({ lastUsedAt: new Date(), updatedAt: new Date() })
    .where(eq(apiKeys.id, foundKey.id));

  return {
    valid: true,
    apiKey: foundKey,
    organization: foundKey.organization,
  };
}

/**
 * Get or seed default demo organization for development/exploration.
 */
export async function getOrCreateDefaultOrg(): Promise<{ org: Organization; membership: OrgMembership }> {
  const defaultSlug = "aurumend-corp";

  let org = await db.query.organizations.findFirst({
    where: eq(organizations.slug, defaultSlug),
  });

  if (!org) {
    const [newOrg] = await db
      .insert(organizations)
      .values({
        name: "Aurumend Sovereign Corp",
        slug: defaultSlug,
        roleMode: "hybrid",
        externalAuthOrgId: "org_default_aurumend",
      })
      .returning();
    org = newOrg;
  }

  let membership = await db.query.orgMemberships.findFirst({
    where: eq(orgMemberships.orgId, org.id),
  });

  if (!membership) {
    const [newMembership] = await db
      .insert(orgMemberships)
      .values({
        orgId: org.id,
        externalUserId: "usr_aurumend_architect",
        githubUsername: "aurumend-admin",
        role: "admin",
      })
      .returning();
    membership = newMembership;
  }

  return { org, membership };
}

/**
 * Retrieve the current active session from cookies or fallback to default organization.
 */
export async function getSession(): Promise<SessionUser> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("aurumend_session")?.value;

  if (sessionToken) {
    try {
      const decoded = jwt.verify(sessionToken, JWT_SECRET) as SessionUser;
      return decoded;
    } catch {
      // invalid token, fallback
    }
  }

  const { org, membership } = await getOrCreateDefaultOrg();

  return {
    userId: membership.externalUserId,
    email: "architect@aurumend.io",
    name: "Sovereign Architect",
    githubUsername: membership.githubUsername ?? "aurumend-admin",
    orgId: org.id,
    orgSlug: org.slug,
    role: membership.role,
    roleMode: org.roleMode,
  };
}

/**
 * Sets session cookie with signed JWT.
 */
export function createSessionToken(user: SessionUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
}
