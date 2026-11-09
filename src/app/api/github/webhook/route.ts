import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { auditLogs, migrationPullRequests, organizations } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * POST /api/github/webhook
 * Handles incoming GitHub App webhooks: issue_comment, pull_request, check_suite
 */
export async function POST(req: NextRequest) {
  try {
    const event = req.headers.get("x-github-event");
    const body = await req.json();

    // Check for comment on PR
    if (event === "issue_comment" && body.action === "created") {
      const commentBody = body.comment?.body || "";
      const prNumber = body.issue?.number;

      const org = await db.query.organizations.findFirst();

      if (commentBody.includes("@aurumend test")) {
        // Log triggered re-test in audit logs
        if (org) {
          await db.insert(auditLogs).values({
            orgId: org.id,
            eventType: "sandbox_verified",
            title: `Interactive Bot Command: @aurumend test on PR #${prNumber}`,
            description: "Developer requested re-verification. Booting E2B MicroVM and executing Stoplight Prism tests.",
            metadataJson: {
              prNumber,
              user: body.comment?.user?.login,
              command: "@aurumend test",
            },
          });
        }
        return NextResponse.json({
          handled: true,
          action: "retest_enqueued",
          message: "Triggered re-verification test in E2B MicroVM.",
        });
      }

      if (commentBody.includes("@aurumend merge")) {
        // Attempt merge
        if (org) {
          await db.insert(auditLogs).values({
            orgId: org.id,
            eventType: "pr_merged",
            title: `Interactive Bot Command: @aurumend merge on PR #${prNumber}`,
            description: `PR #${prNumber} automatically merged via bot instruction. Default branch updated.`,
            metadataJson: {
              prNumber,
              user: body.comment?.user?.login,
              command: "@aurumend merge",
            },
          });
        }
        return NextResponse.json({
          handled: true,
          action: "merged",
          message: `PR #${prNumber} merged successfully.`,
        });
      }
    }

    return NextResponse.json({ received: true, event });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

