import { task } from "@trigger.dev/sdk/v3";
import { indexCustomerRepository } from "@/lib/ast-indexer";
import { executeAutonomousMigration } from "@/lib/autonomous-migration";

/**
 * Trigger.dev v3 Background Task: Customer Repository AST Indexing
 */
export const indexCustomerRepoTask = task({
  id: "index-customer-repository",
  run: async (payload: {
    orgId: string;
    installationId: number | bigint;
    repoFullName: string;
    files: Record<string, string>;
  }) => {
    console.log(`[Trigger.dev] Indexing repository: ${payload.repoFullName}`);
    const result = await indexCustomerRepository(payload);
    return result;
  },
});

/**
 * Trigger.dev v3 Background Task: Execute Autonomous Code Refactoring & E2B Verification
 */
export const executeMigrationTask = task({
  id: "execute-autonomous-migration",
  run: async (payload: {
    vendorReleaseId: string;
    subscriptionId: string;
  }) => {
    console.log(
      `[Trigger.dev] Executing migration for Release ${payload.vendorReleaseId} on Subscription ${payload.subscriptionId}`
    );
    const result = await executeAutonomousMigration(payload);
    return result;
  },
});
