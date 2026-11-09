import { parse, Lang } from "@ast-grep/napi";
import { db } from "@/db";
import { repoApiSubscriptions } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import fs from "fs/promises";
import path from "path";

export interface AstMatch {
  vendorSlug: string;
  kind: "sdk_instance" | "sdk_call" | "raw_fetch" | "webhook_handler";
  filePath: string;
  lineStart: number;
  lineEnd: number;
  matchedText: string;
  pattern: string;
}

export interface IndexingResult {
  repoFullName: string;
  filesScanned: number;
  detectedVendors: string[];
  matches: AstMatch[];
  subscriptionsUpserted: number;
}

// Vendor detection rules for @ast-grep
const VENDOR_PATTERNS = [
  // Stripe
  {
    vendorSlug: "stripe",
    kind: "sdk_instance" as const,
    pattern: "new Stripe($$$ARGS)",
    description: "Stripe SDK constructor instantiation",
  },
  {
    vendorSlug: "stripe",
    kind: "sdk_call" as const,
    pattern: "$OBJ.charges.create($$$ARGS)",
    description: "Stripe charges.create method call",
  },
  {
    vendorSlug: "stripe",
    kind: "raw_fetch" as const,
    pattern: "fetch($$$ARGS)",
    description: "Outbound HTTP fetch",
    urlCheck: "api.stripe.com",
  },
  // OpenAI
  {
    vendorSlug: "openai",
    kind: "sdk_instance" as const,
    pattern: "new OpenAI($$$ARGS)",
    description: "OpenAI SDK constructor instantiation",
  },
  {
    vendorSlug: "openai",
    kind: "sdk_call" as const,
    pattern: "$OBJ.chat.completions.create($$$ARGS)",
    description: "OpenAI chat completions create",
  },
  {
    vendorSlug: "openai",
    kind: "raw_fetch" as const,
    pattern: "fetch($$$ARGS)",
    description: "Outbound HTTP fetch",
    urlCheck: "api.openai.com",
  },
  // Resend
  {
    vendorSlug: "resend",
    kind: "sdk_instance" as const,
    pattern: "new Resend($$$ARGS)",
    description: "Resend SDK constructor instantiation",
  },
  {
    vendorSlug: "resend",
    kind: "sdk_call" as const,
    pattern: "$OBJ.emails.send($$$ARGS)",
    description: "Resend emails.send call",
  },
  // Python Patterns
  {
    vendorSlug: "stripe",
    kind: "sdk_call" as const,
    pattern: "stripe.Charge.create($$$ARGS)",
    description: "Python Stripe Charge.create method call",
  },
  {
    vendorSlug: "openai",
    kind: "sdk_call" as const,
    pattern: "openai.ChatCompletion.create($$$ARGS)",
    description: "Python OpenAI ChatCompletion.create call",
  },
  {
    vendorSlug: "twilio",
    kind: "sdk_instance" as const,
    pattern: "Client($$$ARGS)",
    description: "Twilio Client instantiation",
  },
];

/**
 * Scan a single source code file using @ast-grep/napi Tree-sitter AST
 */
export function scanFileWithAstGrep(
  filePath: string,
  content: string
): AstMatch[] {
  const matches: AstMatch[] = [];

  // Determine language based on extension
  const ext = path.extname(filePath).toLowerCase();
  let lang = Lang.TypeScript;
  if (ext === ".js" || ext === ".jsx") lang = Lang.JavaScript;
  if (ext === ".tsx") lang = Lang.Tsx;
  if (ext === ".py") {
    // If Lang.Python is supported in @ast-grep/napi, use it; otherwise fallback
    try {
      if ((Lang as any).Python !== undefined) {
        lang = (Lang as any).Python;
      }
    } catch {
      lang = Lang.TypeScript;
    }
  }

  try {
    const root = parse(lang, content);
    const sgRoot = root.root();

    for (const rule of VENDOR_PATTERNS) {
      try {
        const found = sgRoot.findAll({ rule: { pattern: rule.pattern } });
        for (const node of found) {
          const matchedText = node.text();

          // If it's a fetch pattern, check if the argument contains the vendor's domain
          if (rule.urlCheck && !matchedText.includes(rule.urlCheck)) {
            continue;
          }

          const range = node.range();
          matches.push({
            vendorSlug: rule.vendorSlug,
            kind: rule.kind,
            filePath,
            lineStart: range.start.line + 1,
            lineEnd: range.end.line + 1,
            matchedText: matchedText.slice(0, 150),
            pattern: rule.pattern,
          });
        }
      } catch (err) {
        // Continue scanning other rules
      }
    }

    // Check for webhook handlers (e.g. route handler matching stripe / openai webhooks)
    if (filePath.includes("webhook") || content.includes("stripe-signature")) {
      const webhookPattern = sgRoot.findAll({
        rule: { pattern: "export async function POST($$$ARGS) { $$$BODY }" },
      });
      for (const node of webhookPattern) {
        const text = node.text();
        if (text.includes("stripe") || text.includes("charges") || text.includes("webhook")) {
          const range = node.range();
          matches.push({
            vendorSlug: "stripe",
            kind: "webhook_handler",
            filePath,
            lineStart: range.start.line + 1,
            lineEnd: range.end.line + 1,
            matchedText: "Webhook handler for Stripe events",
            pattern: "POST webhook route",
          });
        }
      }
    }
  } catch (err) {
    console.warn(`[AST-Grep] Error parsing file ${filePath}:`, err);
  }

  return matches;
}

/**
 * Recursively scans files in an in-memory dictionary or directory
 */
export async function scanRepositoryFiles(
  files: Record<string, string>
): Promise<AstMatch[]> {
  const allMatches: AstMatch[] = [];
  for (const [filePath, content] of Object.entries(files)) {
    const fileMatches = scanFileWithAstGrep(filePath, content);
    allMatches.push(...fileMatches);
  }
  return allMatches;
}

/**
 * Core indexing pipeline: scans code, traces AST call-sites, and upserts subscriptions
 */
export async function indexCustomerRepository(params: {
  orgId: string;
  installationId: number | bigint;
  repoFullName: string;
  files: Record<string, string>;
  commitSha?: string;
}): Promise<IndexingResult> {
  const { orgId, installationId, repoFullName, files, commitSha } = params;

  // 1. Scan files with @ast-grep
  const matches = await scanRepositoryFiles(files);

  // 2. Group matches by vendorSlug
  const vendorMap: Record<string, Array<{ path: string; lines: number[]; matchedText: string }>> = {};

  for (const m of matches) {
    if (!vendorMap[m.vendorSlug]) {
      vendorMap[m.vendorSlug] = [];
    }
    vendorMap[m.vendorSlug].push({
      path: m.filePath,
      lines: [m.lineStart, m.lineEnd],
      matchedText: m.matchedText,
    });
  }

  // 3. Upsert subscriptions into repo_api_subscriptions
  let subscriptionsUpserted = 0;
  const detectedVendors = Object.keys(vendorMap);

  for (const vendorSlug of detectedVendors) {
    const affectedFiles = vendorMap[vendorSlug];

    const existing = await db.query.repoApiSubscriptions.findFirst({
      where: and(
        eq(repoApiSubscriptions.repoFullName, repoFullName),
        eq(repoApiSubscriptions.vendorSlug, vendorSlug)
      ),
    });

    if (existing) {
      await db
        .update(repoApiSubscriptions)
        .set({
          affectedFilePaths: affectedFiles,
          lastScannedSha: commitSha || "sha_head",
          updatedAt: new Date(),
        })
        .where(eq(repoApiSubscriptions.id, existing.id));
    } else {
      await db.insert(repoApiSubscriptions).values({
        consumerOrgId: orgId,
        githubInstallationId: BigInt(installationId),
        repoFullName,
        vendorSlug,
        endpointPattern: "*",
        affectedFilePaths: affectedFiles,
        lastScannedSha: commitSha || "sha_head",
      });
    }

    subscriptionsUpserted++;
  }

  return {
    repoFullName,
    filesScanned: Object.keys(files).length,
    detectedVendors,
    matches,
    subscriptionsUpserted,
  };
}

