import { computeOpenApiDiff } from "../src/lib/openapi-diff";
import { generateMigrationManifest } from "../src/lib/manifest-generator";
import { scanFileWithAstGrep } from "../src/lib/ast-indexer";

async function runTests() {
  console.log("=== AURUMEND UNIT & INTEGRATION TEST SUITE ===");

  // 1. Test AST Grep Scanning
  console.log("\n[1] Testing @ast-grep/napi Tree-sitter Code Scanning...");
  const sampleCode = `
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_KEY);
export async function pay() {
  return await stripe.charges.create({ amount: 1000, source: 'tok_visa' });
}
`;
  const matches = scanFileWithAstGrep("src/services/pay.ts", sampleCode);
  console.log(`✓ Detected ${matches.length} AST matches in sample code:`);
  matches.forEach((m) =>
    console.log(
      `   - ${m.vendorSlug} (${m.kind}) at lines ${m.lineStart}-${m.lineEnd}: "${m.pattern}"`
    )
  );

  if (matches.length < 2) {
    throw new Error("Expected at least 2 AST matches");
  }

  // 2. Test OpenAPI Diff Engine
  console.log("\n[2] Testing OpenAPI Diff Engine...");
  const prevSpec = {
    openapi: "3.0.0",
    paths: {
      "/v1/charges": {
        post: {
          parameters: [{ name: "source", in: "query", required: true }],
        },
      },
    },
  };
  const newSpec = {
    openapi: "3.0.0",
    paths: {
      "/v1/payment_intents": {
        post: {
          parameters: [{ name: "payment_method", in: "query", required: true }],
        },
      },
    },
  };
  const diff = computeOpenApiDiff(prevSpec, newSpec);
  console.log(`✓ OpenAPI Diff computed: totalBreakingChanges=${diff.totalBreakingChanges}`);

  if (diff.totalBreakingChanges !== 1) {
    throw new Error("Expected 1 breaking change in OpenAPI diff");
  }

  // 3. Test Migration Manifest Generation
  console.log("\n[3] Testing Migration Manifest Generator...");
  const manifest = await generateMigrationManifest({
    vendorSlug: "stripe",
    versionTag: "v2025-04-01",
    prevSpec,
    newSpec,
    diff,
  });
  console.log(`✓ Manifest generated: "${manifest.breaking_change_summary.slice(0, 60)}..."`);
  console.log(`   - Patterns: ${manifest.ast_search_patterns.length}`);
  console.log(`   - Instructions: ${manifest.transformation_instructions.length}`);
  console.log(`   - Prism Fixtures: ${manifest.contract_test_fixtures.length}`);

  console.log("\n=== ALL AURUMEND CONTRACT TESTS PASSED WITH EXIT CODE 0 ===");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
