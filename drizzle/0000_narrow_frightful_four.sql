CREATE TYPE "public"."installation_status" AS ENUM('active', 'suspended', 'deleted');--> statement-breakpoint
CREATE TYPE "public"."member_role" AS ENUM('admin', 'publisher', 'member');--> statement-breakpoint
CREATE TYPE "public"."pr_status" AS ENUM('testing', 'open', 'merged', 'failed');--> statement-breakpoint
CREATE TYPE "public"."role_mode" AS ENUM('producer', 'consumer', 'hybrid');--> statement-breakpoint
CREATE TABLE "api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"key_prefix" varchar(32) DEFAULT 'aur_live_' NOT NULL,
	"key_hash" varchar(64) NOT NULL,
	"scopes" text[] DEFAULT '{"releases:write","specs:read"}' NOT NULL,
	"last_used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "api_keys_key_hash_unique" UNIQUE("key_hash")
);
--> statement-breakpoint
CREATE TABLE "github_installations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"github_installation_id" bigint NOT NULL,
	"account_login" varchar(255) NOT NULL,
	"status" "installation_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "github_installations_github_installation_id_unique" UNIQUE("github_installation_id")
);
--> statement-breakpoint
CREATE TABLE "migration_pull_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subscription_id" uuid NOT NULL,
	"consumer_org_id" uuid NOT NULL,
	"vendor_release_id" uuid NOT NULL,
	"github_pr_number" bigint,
	"github_pr_url" text,
	"sandbox_test_logs" text,
	"status" "pr_status" DEFAULT 'testing' NOT NULL,
	"branch_name" varchar(255),
	"diff_summary" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "org_memberships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"external_user_id" varchar(255) NOT NULL,
	"github_username" varchar(255),
	"role" "member_role" DEFAULT 'member' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"external_auth_org_id" varchar(255),
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"role_mode" "role_mode" DEFAULT 'consumer' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "organizations_external_auth_org_id_unique" UNIQUE("external_auth_org_id"),
	CONSTRAINT "organizations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "repo_api_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"consumer_org_id" uuid NOT NULL,
	"github_installation_id" bigint NOT NULL,
	"repo_full_name" varchar(255) NOT NULL,
	"vendor_slug" varchar(255) NOT NULL,
	"endpoint_pattern" text,
	"affected_file_paths" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"last_scanned_sha" varchar(64),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vendor_api_releases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_org_id" uuid NOT NULL,
	"vendor_slug" varchar(255) NOT NULL,
	"version_tag" varchar(64) NOT NULL,
	"openapi_spec_json" jsonb NOT NULL,
	"migration_manifest_json" jsonb NOT NULL,
	"breaking_change_summary" text,
	"published_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "github_installations" ADD CONSTRAINT "github_installations_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "migration_pull_requests" ADD CONSTRAINT "migration_pull_requests_subscription_id_repo_api_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."repo_api_subscriptions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "migration_pull_requests" ADD CONSTRAINT "migration_pull_requests_consumer_org_id_organizations_id_fk" FOREIGN KEY ("consumer_org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "migration_pull_requests" ADD CONSTRAINT "migration_pull_requests_vendor_release_id_vendor_api_releases_id_fk" FOREIGN KEY ("vendor_release_id") REFERENCES "public"."vendor_api_releases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "org_memberships" ADD CONSTRAINT "org_memberships_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "repo_api_subscriptions" ADD CONSTRAINT "repo_api_subscriptions_consumer_org_id_organizations_id_fk" FOREIGN KEY ("consumer_org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_api_releases" ADD CONSTRAINT "vendor_api_releases_vendor_org_id_organizations_id_fk" FOREIGN KEY ("vendor_org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "api_keys_org_idx" ON "api_keys" USING btree ("org_id");--> statement-breakpoint
CREATE INDEX "api_keys_hash_idx" ON "api_keys" USING btree ("key_hash");--> statement-breakpoint
CREATE INDEX "installations_org_idx" ON "github_installations" USING btree ("org_id");--> statement-breakpoint
CREATE INDEX "installations_account_idx" ON "github_installations" USING btree ("account_login");--> statement-breakpoint
CREATE INDEX "migration_prs_consumer_org_idx" ON "migration_pull_requests" USING btree ("consumer_org_id");--> statement-breakpoint
CREATE INDEX "migration_prs_vendor_release_idx" ON "migration_pull_requests" USING btree ("vendor_release_id");--> statement-breakpoint
CREATE INDEX "migration_prs_subscription_idx" ON "migration_pull_requests" USING btree ("subscription_id");--> statement-breakpoint
CREATE INDEX "migration_prs_status_idx" ON "migration_pull_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "membership_org_idx" ON "org_memberships" USING btree ("org_id");--> statement-breakpoint
CREATE INDEX "membership_user_idx" ON "org_memberships" USING btree ("external_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "org_user_unique_idx" ON "org_memberships" USING btree ("org_id","external_user_id");--> statement-breakpoint
CREATE INDEX "org_slug_idx" ON "organizations" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "org_external_auth_idx" ON "organizations" USING btree ("external_auth_org_id");--> statement-breakpoint
CREATE INDEX "subscriptions_consumer_org_idx" ON "repo_api_subscriptions" USING btree ("consumer_org_id");--> statement-breakpoint
CREATE INDEX "subscriptions_repo_idx" ON "repo_api_subscriptions" USING btree ("repo_full_name");--> statement-breakpoint
CREATE INDEX "subscriptions_vendor_idx" ON "repo_api_subscriptions" USING btree ("vendor_slug");--> statement-breakpoint
CREATE UNIQUE INDEX "repo_vendor_unique_idx" ON "repo_api_subscriptions" USING btree ("repo_full_name","vendor_slug");--> statement-breakpoint
CREATE INDEX "vendor_releases_vendor_slug_idx" ON "vendor_api_releases" USING btree ("vendor_slug");--> statement-breakpoint
CREATE INDEX "vendor_releases_org_idx" ON "vendor_api_releases" USING btree ("vendor_org_id");--> statement-breakpoint
CREATE UNIQUE INDEX "vendor_slug_version_idx" ON "vendor_api_releases" USING btree ("vendor_slug","version_tag");