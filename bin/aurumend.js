#!/usr/bin/env node

/**
 * AURUMEND CLI — The Sovereign Protocol for Self-Healing APIs
 * Usage:
 *   npx aurumend scan [--dir <path>]
 *   npx aurumend publish --spec <file> --prev <file> --vendor <slug> --version <tag> [--token <key>] [--url <url>]
 *   npx aurumend check-auth [--token <key>] [--url <url>]
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const args = process.argv.slice(2);
const command = args[0] || "help";

function getArg(flag) {
  const idx = args.indexOf(flag);
  if (idx !== -1 && idx + 1 < args.length) {
    return args[idx + 1];
  }
  return null;
}

const DEFAULT_URL = process.env.AURUMEND_URL || "http://localhost:3000";
const TOKEN = getArg("--token") || process.env.AURUMEND_API_KEY || "";

function makeRequest(urlStr, options = {}, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const client = url.protocol === "https:" ? https : http;

    const req = client.request(
      url,
      {
        method: options.method || "GET",
        headers: options.headers || {},
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(body);
            resolve({ status: res.statusCode, data: parsed });
          } catch {
            resolve({ status: res.statusCode, text: body });
          }
        });
      }
    );

    req.on("error", reject);
    if (data) {
      req.write(typeof data === "string" ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function handleScan() {
  const targetDir = getArg("--dir") || process.cwd();
  console.log("\x1b[33m%s\x1b[0m", `\n🏛️  [AURUMEND CLI] Scanning repository for external API AST call-sites...`);
  console.log(`Directory: ${targetDir}\n`);

  // Dynamically import ast scanner if available locally
  let scanFunction;
  try {
    const ast = require("../src/lib/ast-indexer");
    scanFunction = ast.scanFileWithAstGrep;
  } catch {
    // Fallback simple AST regex detector
  }

  const exts = [".ts", ".tsx", ".js", ".jsx"];
  const matches = [];

  function walk(dir) {
    const list = fs.readdirSync(dir);
    for (const item of list) {
      if (item === "node_modules" || item === ".git" || item === ".next") continue;
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (exts.includes(path.extname(fullPath))) {
        const content = fs.readFileSync(fullPath, "utf8");
        if (scanFunction) {
          const m = scanFunction(path.relative(targetDir, fullPath), content);
          matches.push(...m);
        } else {
          // Fallback pattern matching
          if (content.includes("new Stripe") || content.includes("charges.create")) {
            matches.push({
              vendorSlug: "stripe",
              kind: "sdk_call",
              filePath: path.relative(targetDir, fullPath),
              pattern: "stripe.charges.create",
            });
          }
          if (content.includes("new OpenAI") || content.includes("chat.completions")) {
            matches.push({
              vendorSlug: "openai",
              kind: "sdk_call",
              filePath: path.relative(targetDir, fullPath),
              pattern: "openai.chat.completions.create",
            });
          }
        }
      }
    }
  }

  try {
    walk(targetDir);
  } catch (err) {
    console.error("Scan error:", err.message);
  }

  if (matches.length === 0) {
    console.log("\x1b[32m%s\x1b[0m", "✓ No external API deprecations or unmanaged call-sites detected.");
  } else {
    console.log("\x1b[36m%s\x1b[0m", `Found ${matches.length} external API call-site(s):`);
    console.table(
      matches.map((m) => ({
        Vendor: m.vendorSlug.toUpperCase(),
        File: m.filePath,
        Line: m.lineStart ? `${m.lineStart}-${m.lineEnd}` : "detected",
        Pattern: m.pattern,
      }))
    );
    console.log("\x1b[33m%s\x1b[0m", `\n→ Run 'npx aurumend publish' or push to GitHub to activate contract verification.\n`);
  }
}

async function handleCheckAuth() {
  const token = TOKEN;
  const baseUrl = getArg("--url") || DEFAULT_URL;

  if (!token) {
    console.error("\x1b[31m%s\x1b[0m", "Error: Missing API Key. Pass --token aur_live_... or set AURUMEND_API_KEY.");
    process.exit(1);
  }

  console.log(`Verifying token with Aurumend Control Plane at ${baseUrl}...`);
  try {
    const res = await makeRequest(`${baseUrl}/api/v1/cli/auth`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 200 && res.data.authenticated) {
      console.log("\x1b[32m%s\x1b[0m", "✓ Authentication Successful!");
      console.log(`Organization: ${res.data.organization.name} (${res.data.organization.slug})`);
      console.log(`Scopes: ${res.data.scopes.join(", ")}`);
    } else {
      console.error("\x1b[31m%s\x1b[0m", `Authentication Failed (HTTP ${res.status}):`, res.data?.error || res.text);
      process.exit(1);
    }
  } catch (err) {
    console.error("\x1b[31m%s\x1b[0m", "Network error:", err.message);
    process.exit(1);
  }
}

async function handlePublish() {
  const specPath = getArg("--spec");
  const prevSpecPath = getArg("--prev");
  const vendor = getArg("--vendor") || "stripe";
  const version = getArg("--version") || "v2.0.0";
  const notes = getArg("--notes") || "CI automated release publish";
  const token = TOKEN;
  const baseUrl = getArg("--url") || DEFAULT_URL;

  if (!specPath || !fs.existsSync(specPath)) {
    console.error("\x1b[31m%s\x1b[0m", "Error: Target OpenAPI spec file (--spec) required and must exist.");
    process.exit(1);
  }

  const newSpec = JSON.parse(fs.readFileSync(specPath, "utf8"));
  const prevSpec = prevSpecPath && fs.existsSync(prevSpecPath)
    ? JSON.parse(fs.readFileSync(prevSpecPath, "utf8"))
    : {};

  console.log("\x1b[33m%s\x1b[0m", `\n🏛️  [AURUMEND CLI] Publishing API Release: ${vendor}@${version}...`);

  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const res = await makeRequest(
      `${baseUrl}/api/v1/releases/publish`,
      { method: "POST", headers },
      {
        vendor_slug: vendor,
        version_tag: version,
        new_spec: newSpec,
        prev_spec: prevSpec,
        release_notes: notes,
      }
    );

    if (res.status === 200 && res.data.success) {
      console.log("\x1b[32m%s\x1b[0m", "✓ Release Published Successfully!");
      console.log(`Release ID: ${res.data.release_id}`);
      console.log(`Breaking Changes Detected: ${res.data.breaking_changes_detected}`);
      console.log(`Subscriber Repos Dispatched: ${res.data.subscribers_notified}`);
      console.log(`Migration PRs Enqueued: ${res.data.enqueued_migration_prs.length}\n`);
    } else {
      console.error("\x1b[31m%s\x1b[0m", `Publish Failed (HTTP ${res.status}):`, res.data?.error || res.text);
      process.exit(1);
    }
  } catch (err) {
    console.error("\x1b[31m%s\x1b[0m", "Network error:", err.message);
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
\x1b[33m🏛️  AURUMEND CLI — The Sovereign Protocol for Self-Healing APIs\x1b[0m

Commands:
  scan                  Scan current repository using Tree-sitter AST for external API calls
                        Flags: [--dir <path>]

  publish               Publish an OpenAPI spec release and dispatch self-healing PRs
                        Flags: --spec <file> [--prev <file>] --vendor <slug> --version <tag>
                               [--token <aur_live_...>] [--notes <markdown>] [--url <url>]

  check-auth            Validate an API key with the Sovereign Control Plane
                        Flags: --token <aur_live_...> [--url <url>]

Examples:
  npx aurumend scan
  npx aurumend publish --spec ./openapi/v2.json --prev ./openapi/v1.json --vendor stripe --version v2025-04
  npx aurumend check-auth --token aur_live_xxxxxxxx
`);
}

switch (command) {
  case "scan":
    handleScan();
    break;
  case "publish":
    handlePublish();
    break;
  case "check-auth":
    handleCheckAuth();
    break;
  default:
    showHelp();
    break;
}
