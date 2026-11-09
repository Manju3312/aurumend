/**
 * Comprehensive Senior QA Deep Test Suite
 * Tests all endpoints, edge cases, error handling, input validation, and anchor integrity.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const BASE_URL = "http://localhost:3000";

function request(method, urlPath, headers = {}, body = null) {
  return new Promise((resolve) => {
    const url = new URL(urlPath, BASE_URL);
    const req = http.request(
      url,
      {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          let json = null;
          try {
            json = JSON.parse(data);
          } catch {}
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data,
            json,
          });
        });
      }
    );

    req.on("error", (err) => {
      resolve({ status: 0, error: err.message, body: "" });
    });

    if (body !== null) {
      req.write(typeof body === "string" ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runQaAudit() {
  const findings = [];
  const passed = [];

  console.log("===============================================================");
  console.log("       AURUMEND SENIOR QA AUTOMATED DEEP AUDIT SUITE");
  console.log("===============================================================\n");

  // -------------------------------------------------------------
  // TEST GROUP 1: FRONTEND PAGES
  // -------------------------------------------------------------
  console.log("--- TEST GROUP 1: FRONTEND PAGES & ROUTING ---");
  const pages = ["/", "/dashboard", "/dashboard/producer", "/sign-in", "/onboarding", "/non-existent-page"];
  for (const p of pages) {
    const res = await request("GET", p);
    const expected = p === "/non-existent-page" ? 404 : 200;
    if (res.status === expected) {
      console.log(`✓ GET ${p} returned ${res.status}`);
      passed.push(`GET ${p}`);
    } else {
      console.error(`✗ GET ${p} returned ${res.status} (expected ${expected})`);
      findings.push({
        severity: "HIGH",
        category: "Routing",
        title: `Page route ${p} returned unexpected status ${res.status}`,
        details: `Expected HTTP ${expected}, received ${res.status}`,
      });
    }
  }

  // -------------------------------------------------------------
  // TEST GROUP 2: API HAPPY PATHS
  // -------------------------------------------------------------
  console.log("\n--- TEST GROUP 2: API ENDPOINTS (HAPPY PATHS) ---");

  // 2.1 Dashboard data
  const dashRes = await request("GET", "/api/v1/dashboard/data");
  if (dashRes.status === 200 && dashRes.json?.session) {
    console.log("✓ GET /api/v1/dashboard/data: session & org returned cleanly");
    passed.push("GET /api/v1/dashboard/data");
  } else {
    findings.push({
      severity: "CRITICAL",
      category: "API",
      title: "Dashboard Data API failed",
      details: `Status ${dashRes.status}, response: ${dashRes.body.slice(0, 100)}`,
    });
  }

  // 2.2 Telemetry circuit breaker GET
  const cbGet = await request("GET", "/api/v1/telemetry/circuit-breaker");
  if (cbGet.status === 200 && Array.isArray(cbGet.json?.shields)) {
    console.log(`✓ GET /api/v1/telemetry/circuit-breaker: ${cbGet.json.shields.length} shields active`);
    passed.push("GET /api/v1/telemetry/circuit-breaker");
  } else {
    findings.push({
      severity: "HIGH",
      category: "Telemetry",
      title: "Circuit breaker telemetry GET failed",
      details: `Status ${cbGet.status}`,
    });
  }

  // 2.3 Telemetry circuit breaker POST
  const cbPost = await request("POST", "/api/v1/telemetry/circuit-breaker", {}, {
    vendorSlug: "stripe",
    eventType: "circuit_breaker_ping",
    endpoint: "/v1/charges",
    state: "CLOSED",
    consecutiveFailures: 0,
  });
  if (cbPost.status === 200 && cbPost.json?.received) {
    console.log("✓ POST /api/v1/telemetry/circuit-breaker accepted telemetry ping");
    passed.push("POST /api/v1/telemetry/circuit-breaker");
  } else {
    findings.push({
      severity: "MEDIUM",
      category: "Telemetry",
      title: "Circuit breaker telemetry POST failed",
      details: `Status ${cbPost.status}`,
    });
  }

  // 2.4 Harvester poll GET & POST
  const hGet = await request("GET", "/api/v1/harvester/poll");
  if (hGet.status === 200 && hGet.json?.totalMonitored > 0) {
    console.log(`✓ GET /api/v1/harvester/poll: ${hGet.json.totalMonitored} targets returned`);
    passed.push("GET /api/v1/harvester/poll");
  } else {
    findings.push({
      severity: "HIGH",
      category: "Harvester",
      title: "Harvester poll GET failed",
      details: `Status ${hGet.status}`,
    });
  }

  const hPost = await request("POST", "/api/v1/harvester/poll");
  if (hPost.status === 200 && hPost.json?.polledCount > 0) {
    console.log(`✓ POST /api/v1/harvester/poll: Polled ${hPost.json.polledCount} targets`);
    passed.push("POST /api/v1/harvester/poll");
  } else {
    findings.push({
      severity: "HIGH",
      category: "Harvester",
      title: "Harvester poll POST failed",
      details: `Status ${hPost.status}`,
    });
  }

  // 2.5 Specs compare
  const specComp = await request("POST", "/api/v1/specs/compare", {}, {
    prev_spec: { openapi: "3.0.0", paths: { "/v1/charges": { post: {} } } },
    new_spec: { openapi: "3.0.0", paths: { "/v1/payment_intents": { post: {} } } },
  });
  if (specComp.status === 200 && specComp.json?.breaking_count === 1) {
    console.log("✓ POST /api/v1/specs/compare: 1 breaking change correctly isolated");
    passed.push("POST /api/v1/specs/compare");
  } else {
    findings.push({
      severity: "CRITICAL",
      category: "Diff Engine",
      title: "OASDiff spec comparison failed",
      details: `Status ${specComp.status}, breaking_count: ${specComp.json?.breaking_count}`,
    });
  }

  // 2.6 Repos scan
  const repoScan = await request("POST", "/api/v1/repos/scan", {}, {
    repo_full_name: "acme-corp/payment-service",
    commit_sha: "sha_test_123",
  });
  if (repoScan.status === 200 && repoScan.json?.success) {
    console.log(`✓ POST /api/v1/repos/scan: Scanned ${repoScan.json.files_scanned} files in ${repoScan.json.scan_duration_ms}ms`);
    passed.push("POST /api/v1/repos/scan");
  } else {
    findings.push({
      severity: "CRITICAL",
      category: "AST Engine",
      title: "Repo scan failed",
      details: `Status ${repoScan.status}, body: ${repoScan.body.slice(0, 100)}`,
    });
  }

  // 2.7 Webhooks simulate
  const whSim = await request("POST", "/api/v1/webhooks/simulate", {}, {
    vendorSlug: "stripe",
    eventType: "payment_intent.succeeded",
  });
  if (whSim.status === 200 && whSim.json?.success) {
    console.log(`✓ POST /api/v1/webhooks/simulate: Verified event in ${whSim.json.duration_ms}ms`);
    passed.push("POST /api/v1/webhooks/simulate");
  } else {
    findings.push({
      severity: "HIGH",
      category: "Webhooks",
      title: "Webhook simulation failed",
      details: `Status ${whSim.status}`,
    });
  }

  // 2.8 Keys GET & POST
  const keysGet = await request("GET", "/api/v1/keys");
  if (keysGet.status === 200 && Array.isArray(keysGet.json?.apiKeys)) {
    console.log(`✓ GET /api/v1/keys: Retrieved ${keysGet.json.apiKeys.length} API keys`);
    passed.push("GET /api/v1/keys");
  } else {
    findings.push({
      severity: "HIGH",
      category: "Auth",
      title: "API Keys GET failed",
      details: `Status ${keysGet.status}`,
    });
  }

  const keyPost = await request("POST", "/api/v1/keys", {}, {
    name: "QA Automated Test Runner Key",
  });
  let createdKeyRaw = null;
  if (keyPost.status === 200 && keyPost.json?.apiKey?.rawKey) {
    createdKeyRaw = keyPost.json.apiKey.rawKey;
    console.log(`✓ POST /api/v1/keys: Successfully generated key prefix ${keyPost.json.apiKey.keyPrefix}`);
    passed.push("POST /api/v1/keys");
  } else {
    findings.push({
      severity: "CRITICAL",
      category: "Auth",
      title: "API Key creation failed",
      details: `Status ${keyPost.status}, body: ${keyPost.body.slice(0, 100)}`,
    });
  }

  // 2.9 CLI Auth verification with newly generated key
  if (createdKeyRaw) {
    const authCheck = await request("GET", "/api/v1/cli/auth", {
      Authorization: `Bearer ${createdKeyRaw}`,
    });
    if (authCheck.status === 200 && authCheck.json?.authenticated) {
      console.log(`✓ GET /api/v1/cli/auth: Successfully authenticated key for org '${authCheck.json.organization.name}'`);
      passed.push("GET /api/v1/cli/auth (valid token)");
    } else {
      findings.push({
        severity: "CRITICAL",
        category: "Auth",
        title: "CLI Authentication with newly minted key failed",
        details: `Status ${authCheck.status}, body: ${authCheck.body.slice(0, 100)}`,
      });
    }
  }

  // 2.10 GitHub Callback handshake
  const ghCb = await request("GET", "/api/github/callback?installation_id=98765432&account=qa-testing-org&setup_action=install");
  if (ghCb.status === 307 || ghCb.status === 200) {
    console.log(`✓ GET /api/github/callback: Handshake redirected properly (Status ${ghCb.status})`);
    passed.push("GET /api/github/callback");
  } else {
    findings.push({
      severity: "HIGH",
      category: "GitHub App",
      title: "GitHub install callback returned error",
      details: `Status ${ghCb.status}`,
    });
  }

  // 2.11 GitHub Webhook bot commands
  const ghBotTest = await request("POST", "/api/github/webhook", { "x-github-event": "issue_comment" }, {
    action: "created",
    issue: { number: 426 },
    comment: { body: "@aurumend test", user: { login: "qa-lead" } },
  });
  if (ghBotTest.status === 200 && ghBotTest.json?.action === "retest_enqueued") {
    console.log("✓ POST /api/github/webhook: @aurumend test enqueued re-verification");
    passed.push("POST /api/github/webhook (@aurumend test)");
  } else {
    findings.push({
      severity: "HIGH",
      category: "GitHub Bot",
      title: "GitHub webhook bot command '@aurumend test' failed",
      details: `Status ${ghBotTest.status}`,
    });
  }

  // -------------------------------------------------------------
  // TEST GROUP 3: NEGATIVE TESTING & INPUT FUZZING
  // -------------------------------------------------------------
  console.log("\n--- TEST GROUP 3: NEGATIVE TESTING & INPUT FUZZING ---");

  // 3.1 CLI auth with invalid token
  const badAuth = await request("GET", "/api/v1/cli/auth", {
    Authorization: "Bearer aur_live_invalid_forged_hash_key",
  });
  if (badAuth.status === 401) {
    console.log("✓ GET /api/v1/cli/auth rejected invalid key with HTTP 401");
    passed.push("GET /api/v1/cli/auth (401 on bad token)");
  } else {
    findings.push({
      severity: "CRITICAL",
      category: "Security",
      title: "CLI Auth failed to reject forged API key with 401",
      details: `Returned status ${badAuth.status} instead of 401`,
    });
  }

  // 3.2 CLI auth with missing header
  const noHeaderAuth = await request("GET", "/api/v1/cli/auth");
  if (noHeaderAuth.status === 401) {
    console.log("✓ GET /api/v1/cli/auth rejected missing Authorization header with HTTP 401");
    passed.push("GET /api/v1/cli/auth (401 on missing header)");
  } else {
    findings.push({
      severity: "CRITICAL",
      category: "Security",
      title: "CLI Auth failed to reject missing Authorization header with 401",
      details: `Returned status ${noHeaderAuth.status} instead of 401`,
    });
  }

  // 3.3 Specs compare with empty body or null specs
  const emptySpecComp = await request("POST", "/api/v1/specs/compare", {}, {});
  if (emptySpecComp.status >= 400 || emptySpecComp.json?.breaking_count === 0) {
    console.log(`✓ POST /api/v1/specs/compare handled empty input safely (${emptySpecComp.status})`);
    passed.push("POST /api/v1/specs/compare (empty body handling)");
  } else {
    findings.push({
      severity: "MEDIUM",
      category: "Input Validation",
      title: "Specs compare did not handle empty input cleanly",
      details: `Returned status ${emptySpecComp.status}`,
    });
  }

  // 3.4 Merge non-existent PR ID
  const badPrMerge = await request("POST", "/api/v1/prs/00000000-0000-0000-0000-000000000000/merge");
  if (badPrMerge.status === 404 || badPrMerge.status === 400 || badPrMerge.json?.error) {
    console.log(`✓ POST /api/v1/prs/[id]/merge handled non-existent PR safely (${badPrMerge.status})`);
    passed.push("POST /api/v1/prs/[non-existent]/merge");
  } else {
    findings.push({
      severity: "HIGH",
      category: "Error Handling",
      title: "PR merge did not properly return 404 on non-existent PR ID",
      details: `Returned status ${badPrMerge.status}: ${badPrMerge.body.slice(0, 100)}`,
    });
  }

  // 3.5 Merge with malformed (non-UUID) ID
  const malformedPrMerge = await request("POST", "/api/v1/prs/invalid-not-uuid/merge");
  if (malformedPrMerge.status >= 400) {
    console.log(`✓ POST /api/v1/prs/invalid-not-uuid/merge rejected malformed UUID (${malformedPrMerge.status})`);
    passed.push("POST /api/v1/prs/[invalid-uuid]/merge");
  } else {
    findings.push({
      severity: "HIGH",
      category: "Error Handling",
      title: "PR merge did not reject malformed non-UUID string",
      details: `Returned status ${malformedPrMerge.status}`,
    });
  }

  // 3.6 Migration execute with missing IDs
  const badMig = await request("POST", "/api/v1/migrations/execute", {}, {});
  if (badMig.status >= 400) {
    console.log(`✓ POST /api/v1/migrations/execute rejected empty payload (${badMig.status})`);
    passed.push("POST /api/v1/migrations/execute (empty payload)");
  } else {
    findings.push({
      severity: "HIGH",
      category: "Input Validation",
      title: "Migration execute endpoint allowed execution without parameters",
      details: `Returned status ${badMig.status}: ${badMig.body.slice(0, 100)}`,
    });
  }

  // 3.7 Release publish with missing required parameters
  const badPub = await request("POST", "/api/v1/releases/publish", {}, {
    vendor_slug: "test-vendor",
    // missing new_spec and version_tag
  });
  if (badPub.status >= 400) {
    console.log(`✓ POST /api/v1/releases/publish rejected incomplete payload (${badPub.status})`);
    passed.push("POST /api/v1/releases/publish (incomplete payload)");
  } else {
    findings.push({
      severity: "HIGH",
      category: "Input Validation",
      title: "Release publish allowed publishing without required new_spec or version_tag",
      details: `Returned status ${badPub.status}: ${badPub.body.slice(0, 100)}`,
    });
  }

  // 3.8 GitHub callback with missing parameters
  const badGhCb = await request("GET", "/api/github/callback");
  if (badGhCb.status >= 400 || badGhCb.json?.error) {
    console.log(`✓ GET /api/github/callback rejected missing parameters (${badGhCb.status})`);
    passed.push("GET /api/github/callback (missing parameters)");
  } else {
    findings.push({
      severity: "MEDIUM",
      category: "Input Validation",
      title: "GitHub callback allowed execution with empty installation_id and account",
      details: `Returned status ${badGhCb.status}: ${badGhCb.body.slice(0, 100)}`,
    });
  }

  // -------------------------------------------------------------
  // TEST GROUP 4: DOM ANCHOR & LINK INTEGRITY
  // -------------------------------------------------------------
  console.log("\n--- TEST GROUP 4: DOM ANCHOR INTEGRITY & NAVIGATION ---");
  const homeHtmlRes = await request("GET", "/");
  const homeHtml = homeHtmlRes.body;

  const requiredAnchors = [
    "interactive-demo",
    "architecture",
    "dual-engine",
    "telemetry-feed",
    "roi-calculator",
  ];

  for (const anchor of requiredAnchors) {
    const idCheck1 = `id="${anchor}"`;
    const idCheck2 = `id='${anchor}'`;
    if (homeHtml.includes(idCheck1) || homeHtml.includes(idCheck2)) {
      console.log(`✓ Anchor #${anchor} exists on home page DOM`);
      passed.push(`DOM Anchor #${anchor}`);
    } else {
      console.error(`✗ Missing Anchor #${anchor} on home page! Nav links will not scroll properly.`);
      findings.push({
        severity: "HIGH",
        category: "UI / Navigation",
        title: `Navbar anchor #${anchor} target missing in HTML markup`,
        details: `Navbar has link href="#${anchor}", but no element has id="${anchor}" in the DOM.`,
      });
    }
  }

  // -------------------------------------------------------------
  // SUMMARY REPORT
  // -------------------------------------------------------------
  console.log("\n===============================================================");
  console.log(`QA AUDIT COMPLETE: ${passed.length} Checks Passed, ${findings.length} Anomalies/Bugs Found`);
  console.log("===============================================================\n");

  console.log(JSON.stringify({ passedCount: passed.length, findings }, null, 2));
}

runQaAudit().catch(console.error);

