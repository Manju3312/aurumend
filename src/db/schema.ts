import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  bigint,
  jsonb,
  pgEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const roleModeEnum = pgEnum("role_mode", ["producer", "consumer", "hybrid"]);
export const memberRoleEnum = pgEnum("member_role", ["admin", "publisher", "member"]);
export const installationStatusEnum = pgEnum("installation_status", ["active", "suspended", "deleted"]);
export const prStatusEnum = pgEnum("pr_status", ["testing", "open", "merged", "failed"]);

// 1. Organizations
export const organizations = pgTable(
  "organizations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    externalAuthOrgId: varchar("external_auth_org_id", { length: 255 }).unique(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    roleMode: roleModeEnum("role_mode").default("consumer").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("org_slug_idx").on(table.slug),
    index("org_external_auth_idx").on(table.externalAuthOrgId),
  ]
);

// 2. Org Memberships
export const orgMemberships = pgTable(
  "org_memberships",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    externalUserId: varchar("external_user_id", { length: 255 }).notNull(),
    githubUsername: varchar("github_username", { length: 255 }),
    role: memberRoleEnum("role").default("member").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("membership_org_idx").on(table.orgId),
    index("membership_user_idx").on(table.externalUserId),
    uniqueIndex("org_user_unique_idx").on(table.orgId, table.externalUserId),
  ]
);

// 3. GitHub Installations
export const githubInstallations = pgTable(
  "github_installations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    githubInstallationId: bigint("github_installation_id", { mode: "bigint" }).notNull().unique(),
    accountLogin: varchar("account_login", { length: 255 }).notNull(),
    status: installationStatusEnum("status").default("active").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("installations_org_idx").on(table.orgId),
    index("installations_account_idx").on(table.accountLogin),
  ]
);

// 4. API Keys (SHA-256 Hashed for CLI/CI authentication)
export const apiKeys = pgTable(
  "api_keys",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    keyPrefix: varchar("key_prefix", { length: 32 }).default("aur_live_").notNull(),
    keyHash: varchar("key_hash", { length: 64 }).notNull().unique(), // SHA-256 hexadecimal string
    scopes: text("scopes").array().default(["releases:write", "specs:read"]).notNull(),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("api_keys_org_idx").on(table.orgId),
    index("api_keys_hash_idx").on(table.keyHash),
  ]
);

// 5. Vendor API Releases (Published by API Vendors / Producers)
export const vendorApiReleases = pgTable(
  "vendor_api_releases",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    vendorOrgId: uuid("vendor_org_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    vendorSlug: varchar("vendor_slug", { length: 255 }).notNull(), // e.g. "stripe", "openai", "resend"
    versionTag: varchar("version_tag", { length: 64 }).notNull(), // e.g. "2025-04-01", "v2.0.0"
    openapiSpecJson: jsonb("openapi_spec_json").notNull(),
    migrationManifestJson: jsonb("migration_manifest_json").notNull(),
    breakingChangeSummary: text("breaking_change_summary"),
    publishedAt: timestamp("published_at", { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("vendor_releases_vendor_slug_idx").on(table.vendorSlug),
    index("vendor_releases_org_idx").on(table.vendorOrgId),
    uniqueIndex("vendor_slug_version_idx").on(table.vendorSlug, table.versionTag),
  ]
);

// 6. Repo API Subscriptions (The Bridge Table linking Consumers to Producers)
export const repoApiSubscriptions = pgTable(
  "repo_api_subscriptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    consumerOrgId: uuid("consumer_org_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    githubInstallationId: bigint("github_installation_id", { mode: "bigint" }).notNull(),
    repoFullName: varchar("repo_full_name", { length: 255 }).notNull(), // e.g. "acme-corp/payment-service"
    vendorSlug: varchar("vendor_slug", { length: 255 }).notNull(), // e.g. "stripe"
    endpointPattern: text("endpoint_pattern"), // optional route pattern or '*'
    affectedFilePaths: jsonb("affected_file_paths").default([]).notNull(), // string[] or { path: string, lines: number[] }[]
    lastScannedSha: varchar("last_scanned_sha", { length: 64 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("subscriptions_consumer_org_idx").on(table.consumerOrgId),
    index("subscriptions_repo_idx").on(table.repoFullName),
    index("subscriptions_vendor_idx").on(table.vendorSlug),
    uniqueIndex("repo_vendor_unique_idx").on(table.repoFullName, table.vendorSlug),
  ]
);

// 7. Migration Pull Requests (Auto-generated contract-verified PRs)
export const migrationPullRequests = pgTable(
  "migration_pull_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    subscriptionId: uuid("subscription_id")
      .notNull()
      .references(() => repoApiSubscriptions.id, { onDelete: "cascade" }),
    consumerOrgId: uuid("consumer_org_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    vendorReleaseId: uuid("vendor_release_id")
      .notNull()
      .references(() => vendorApiReleases.id, { onDelete: "cascade" }),
    githubPrNumber: bigint("github_pr_number", { mode: "number" }),
    githubPrUrl: text("github_pr_url"),
    sandboxTestLogs: text("sandbox_test_logs"),
    status: prStatusEnum("status").default("testing").notNull(),
    branchName: varchar("branch_name", { length: 255 }),
    diffSummary: text("diff_summary"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("migration_prs_consumer_org_idx").on(table.consumerOrgId),
    index("migration_prs_vendor_release_idx").on(table.vendorReleaseId),
    index("migration_prs_subscription_idx").on(table.subscriptionId),
    index("migration_prs_status_idx").on(table.status),
  ]
);

// Relations Definitions
export const organizationsRelations = relations(organizations, ({ many }) => ({
  members: many(orgMemberships),
  installations: many(githubInstallations),
  apiKeys: many(apiKeys),
  vendorReleases: many(vendorApiReleases),
  repoSubscriptions: many(repoApiSubscriptions),
  migrationPullRequests: many(migrationPullRequests),
}));

export const orgMembershipsRelations = relations(orgMemberships, ({ one }) => ({
  organization: one(organizations, {
    fields: [orgMemberships.orgId],
    references: [organizations.id],
  }),
}));

export const githubInstallationsRelations = relations(githubInstallations, ({ one }) => ({
  organization: one(organizations, {
    fields: [githubInstallations.orgId],
    references: [organizations.id],
  }),
}));

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  organization: one(organizations, {
    fields: [apiKeys.orgId],
    references: [organizations.id],
  }),
}));

export const vendorApiReleasesRelations = relations(vendorApiReleases, ({ one, many }) => ({
  vendorOrg: one(organizations, {
    fields: [vendorApiReleases.vendorOrgId],
    references: [organizations.id],
  }),
  pullRequests: many(migrationPullRequests),
}));

export const repoApiSubscriptionsRelations = relations(repoApiSubscriptions, ({ one, many }) => ({
  consumerOrg: one(organizations, {
    fields: [repoApiSubscriptions.consumerOrgId],
    references: [organizations.id],
  }),
  pullRequests: many(migrationPullRequests),
}));

export const migrationPullRequestsRelations = relations(migrationPullRequests, ({ one }) => ({
  subscription: one(repoApiSubscriptions, {
    fields: [migrationPullRequests.subscriptionId],
    references: [repoApiSubscriptions.id],
  }),
  consumerOrg: one(organizations, {
    fields: [migrationPullRequests.consumerOrgId],
    references: [organizations.id],
  }),
  vendorRelease: one(vendorApiReleases, {
    fields: [migrationPullRequests.vendorReleaseId],
    references: [vendorApiReleases.id],
  }),
}));

// Inferred TypeScript Types
export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;

export type OrgMembership = typeof orgMemberships.$inferSelect;
export type NewOrgMembership = typeof orgMemberships.$inferInsert;

export type GithubInstallation = typeof githubInstallations.$inferSelect;
export type NewGithubInstallation = typeof githubInstallations.$inferInsert;

export type ApiKey = typeof apiKeys.$inferSelect;
export type NewApiKey = typeof apiKeys.$inferInsert;

export type VendorApiRelease = typeof vendorApiReleases.$inferSelect;
export type NewVendorApiRelease = typeof vendorApiReleases.$inferInsert;

export type RepoApiSubscription = typeof repoApiSubscriptions.$inferSelect;
export type NewRepoApiSubscription = typeof repoApiSubscriptions.$inferInsert;

export type MigrationPullRequest = typeof migrationPullRequests.$inferSelect;
export type NewMigrationPullRequest = typeof migrationPullRequests.$inferInsert;

