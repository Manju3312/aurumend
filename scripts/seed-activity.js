const postgres = require('postgres');
const crypto = require('crypto');
const sql = postgres('postgresql://postgres:postgres@localhost:5432/aurumend');

function hashApiKey(key) {
  return crypto.createHash("sha256").update(key).digest("hex");
}

async function main() {
  const orgs = await sql.unsafe("SELECT id FROM organizations WHERE slug = 'aurumend-corp'");
  if (orgs.length === 0) {
    console.error("Default org not found");
    return;
  }
  const orgId = orgs[0].id;

  // 1. Seed API Key if none exists
  const existingKeys = await sql.unsafe("SELECT count(*) FROM api_keys WHERE org_id = $1", [orgId]);
  if (parseInt(existingKeys[0].count, 10) === 0) {
    const rawKey = "aur_live_" + crypto.randomBytes(24).toString("hex");
    const keyHash = hashApiKey(rawKey);
    await sql.unsafe(
      `INSERT INTO api_keys (org_id, name, key_prefix, key_hash, scopes, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      [orgId, "Production CI/CD Release Publisher", "aur_live_", keyHash, ["releases:write", "specs:read"]]
    );
    console.log("Seeded sample API key");
  }

  // 2. Seed Audit Logs if empty
  const existingAudit = await sql.unsafe("SELECT count(*) FROM audit_logs WHERE org_id = $1", [orgId]);
  if (parseInt(existingAudit[0].count, 10) === 0) {
    const logs = [
      {
        eventType: "pr_opened",
        title: "Autonomous Self-Healing PR #426 Opened",
        description: "Branch 'aurumend/migrate-stripe-v2025-04-01' opened on acme-corp/payment-service with contract-verified changes.",
        metadata: { prNumber: 426, vendorSlug: "stripe", versionTag: "v2025-04-01", repo: "acme-corp/payment-service" },
        minutesAgo: 12
      },
      {
        eventType: "sandbox_verified",
        title: "E2B MicroVM Sandbox: Contract Tests Passed (Exit Code 0)",
        description: "Stoplight Prism mock server validated 100% contract compliance for transformed PaymentIntents calls.",
        metadata: { sandboxDurationMs: 4210, exitCode: 0, mockTool: "Stoplight Prism CLI v5.8" },
        minutesAgo: 14
      },
      {
        eventType: "spec_diffed",
        title: "OASDiff Ingestion: Stripe v2025-04-01 Breaking Change Detected",
        description: "POST /v1/charges marked as deprecated and removed. Synthesis of migration manifest completed in 840ms.",
        metadata: { diffCount: 1, removedPaths: ["/v1/charges"], addedPaths: ["/v1/payment_intents"] },
        minutesAgo: 16
      },
      {
        eventType: "ast_indexed",
        title: "AST Call-Graph Indexed: acme-corp/payment-service",
        description: "@ast-grep scanned 3 repository source files. Identified 4 active call-sites for Stripe and 2 for OpenAI.",
        metadata: { filesScanned: 3, detectedVendors: ["stripe", "openai"], callSites: 6 },
        minutesAgo: 25
      },
      {
        eventType: "github_installed",
        title: "GitHub App Installation Verified",
        description: "Installation #60540896 linked to Aurumend Sovereign Corp. JIT 1-hour GitHub tokens operational.",
        metadata: { installationId: "60540896", account: "acme-corp" },
        minutesAgo: 45
      }
    ];

    for (const log of logs) {
      await sql.unsafe(
        `INSERT INTO audit_logs (org_id, event_type, title, description, metadata_json, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW() - ($6 || ' minutes')::interval)`,
        [orgId, log.eventType, log.title, log.description, JSON.stringify(log.metadata), log.minutesAgo]
      );
    }
    console.log("Seeded 5 sovereign audit log telemetry events");
  }

  // 3. Seed sample webhook simulator event if empty
  const existingWebhooks = await sql.unsafe("SELECT count(*) FROM webhook_simulator_events WHERE org_id = $1", [orgId]);
  if (parseInt(existingWebhooks[0].count, 10) === 0) {
    await sql.unsafe(
      `INSERT INTO webhook_simulator_events (org_id, vendor_slug, event_type, payload_json, response_status, response_body, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW() - INTERVAL '5 minutes')`,
      [
        orgId,
        "stripe",
        "payment_intent.succeeded",
        JSON.stringify({
          id: "evt_3NtwBwLkdIwHu7ix28a3tqPa",
          object: "event",
          type: "payment_intent.succeeded",
          data: { object: { id: "pi_3MtwBwLkdIwHu7ix28a3tqPa", amount: 2500, currency: "usd", status: "succeeded" } }
        }),
        200,
        JSON.stringify({ received: true, verified_by_aurumend: true, duration_ms: 18 })
      ]
    );
    console.log("Seeded sample webhook simulator event");
  }

  await sql.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

