# AURUMEND 🏛️
### *The Sovereign Protocol for Self-Maintaining APIs*

> *"Digital Kintsugi for Modern Software: When external APIs break, Aurumend heals your codebase with 24K gold precision before production breaks."*

---

## 🌟 Executive Overview
**Aurumend** is an autonomous migration infrastructure platform bridging **API Vendors (Producers)** and **Customer Repositories (Consumers)**. 

When an API vendor ships a breaking change (such as deprecating Stripe's `charges.create` in favor of `paymentIntents.create`, or transitioning OpenAI functions to Structured JSON schemas), Aurumend:
1. Programmatically diffs the OpenAPI specifications using `oasdiff`.
2. Employs **Anthropic Claude Sonnet** to compile a deterministic **Migration Manifest** with Tree-sitter AST search patterns and mock test fixtures.
3. Indexes customer repositories using **`@ast-grep/napi`** to locate exact file paths and line ranges touching deprecated APIs.
4. Boots an ephemeral **E2B MicroVM Sandbox** container running **Stoplight Prism** as a live mock server of the new spec.
5. Autonomously refactors code, tests against the mock server until **Exit Code 0** is verified, and opens a contract-verified **GitHub Pull Request** with detailed audit logs.

---

## 🏛️ Digital Kintsugi Royalty Design System
- **Obsidian Deep Base:** `#070709` (`--bg-obsidian`)
- **Charcoal Elevated Surface:** `#111116` with `backdrop-filter: blur(16px)` (`--bg-charcoal`)
- **24K Royal Gold:** `#D4AF37` (`--gold-royal`)
- **Champagne Gold:** `#F3E5AB` (`--gold-champagne`)
- **Amber Border Accent:** `#996515` / `rgba(212, 175, 55, 0.22)`
- **Ivory White & Silver:** `#FAF9F6` & `#A1A1AA`
- **Typography:** `Cinzel` (Regal Headings), `Plus Jakarta Sans` (Clean UI Headers), `JetBrains Mono` (AST Diffs)
- **Interactive 3D Background:** Built with **Three.js**, **React Three Fiber**, and **Postprocessing Bloom**, featuring floating obsidian polyhedrons connected by a pulsing liquid gold neural bridge.

---

## 🛠️ Complete Tech Stack
| Tier | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend & 3D UI** | Next.js 15 (App Router), React 19, Tailwind CSS, Three.js, R3F, Postprocessing | Royalty UI & WebGL Kintsugi bridge |
| **Multi-Tenant Spine** | PostgreSQL + Drizzle ORM | Multi-tenant organizations, repos, and PR states |
| **GitHub Integration** | `@octokit/auth-app`, `@octokit/rest` | JIT 1-hour ephemeral installation tokens & PR creation |
| **CLI & CI Auth** | SHA-256 Hashed API Keys (`aur_live_...`) | Headless CI/CD release publishing |
| **Spec Diffing & AI** | `oasdiff` + Anthropic Claude Sonnet | Programmatic diffing & Migration Manifest synthesis |
| **AST Indexer** | `@ast-grep/napi` (Rust Tree-sitter) | Syntax-precise call-site detection across TypeScript & Python |
| **Verification Sandbox** | E2B MicroVM (`@e2b/code-interpreter`) + Stoplight Prism | Zero-mock isolated contract verification |
| **Durable Workflows** | Trigger.dev (v3) | Long-running repo scanning and self-healing pipelines |

---

## 📐 Architecture Pipeline

```
┌────────────────────────┐
│  API Producer Release  │ (OpenAPI v1 -> v2 + Markdown Changelog)
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│  Oasdiff + Claude AI   │ ──> Synthesizes Deterministic Migration Manifest
└───────────┬────────────┘     (AST Search Patterns + Test Fixtures)
            │
            ▼
┌────────────────────────┐
│  AST Indexing Engine   │ (Rust-backed @ast-grep/napi)
│  (Consumer Repos)      │ ──> Locates SDK Invocations, Fetch URLs, Webhooks
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│  E2B MicroVM Sandbox   │ ──> Boots isolated container
│  + Stoplight Prism     │ ──> Runs mock server on port 4010
│  Live Mock Server      │ ──> Executes `tsc --noEmit` & `pnpm test`
└───────────┬────────────┘
            │
            ▼ (Exit Code: 0)
┌────────────────────────┐
│  Contract-Verified PR  │ ──> Opens GitHub Pull Request via JIT App Token
└────────────────────────┘
```

---

## 🗄️ Database Schema (`src/db/schema.ts`)
The multi-tenant schema connects every subsystem through `org_id`:
1. `organizations`: Root tenant with `role_mode ('producer' | 'consumer' | 'hybrid')`.
2. `org_memberships`: Role-based access control (`admin`, `publisher`, `member`).
3. `github_installations`: GitHub App installations linked to organizations.
4. `api_keys`: SHA-256 hashed API keys (`aur_live_...`) for CI/CD authentication.
5. `vendor_api_releases`: Published OpenAPI specs and Claude Migration Manifests.
6. `repo_api_subscriptions`: Bridge table linking customer repos to upstream vendor APIs with AST affected file paths.
7. `migration_pull_requests`: PR records with E2B sandbox test logs, branch metadata, and status lifecycle.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js:** `v20+` or `v24+`
- **npm** or **pnpm**
- **PostgreSQL Database:** Local, Neon, or Supabase

### 2. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your credentials:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/aurumend"
JWT_SECRET="aurumend-sovereign-protocol-secret-key-2025"
GITHUB_APP_ID="123456"
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n..."
ANTHROPIC_API_KEY="sk-ant-api03-..."
E2B_API_KEY="e2b_..."
```

### 3. Install Dependencies & Generate Migrations
```bash
npm install
npm run db:generate
```

### 4. Run the Test Suite
```bash
npm test
```

### 5. Launch the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 💻 Aurumend CLI (`npx aurumend`)

The repository includes a standalone CLI binary located at [`bin/aurumend.js`](file:///c:/Users/manju/OneDrive/Desktop/aurumend/bin/aurumend.js).

### Scan Local Repository for API Deprecations
```bash
npx aurumend scan
```
Output:
```text
🏛️  [AURUMEND CLI] Scanning repository for external API AST call-sites...

Found external API call-site(s):
┌─────────┬──────────┬────────────────────────────┬────────────┬──────────────────────────────────┐
│ (index) │ Vendor   │ File                       │ Line       │ Pattern                          │
├─────────┼──────────┼────────────────────────────┼────────────┼──────────────────────────────────┤
│ 0       │ 'STRIPE' │ 'src/services/payment.ts'  │ '9-15'     │ 'stripe.charges.create'          │
│ 1       │ 'OPENAI' │ 'src/services/ai.ts'       │ '8-12'     │ 'openai.chat.completions.create' │
└─────────┴──────────┴────────────────────────────┴────────────┴──────────────────────────────────┘
```

### Publish an OpenAPI Release from CI/CD
```bash
npx aurumend publish \
  --spec ./openapi/v2.json \
  --prev ./openapi/v1.json \
  --vendor stripe \
  --version v2025-04 \
  --token $AURUMEND_API_KEY
```

### Verify CI/CD API Key
```bash
npx aurumend check-auth --token aur_live_xxxxxxxx
```

---

## 📡 REST API Reference

| Endpoint | Method | Auth | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/session` | `POST` | Public | Authenticates user and sets session cookie |
| `/api/github/install` | `GET` | Session | Starts signed GitHub App installation handshake |
| `/api/github/callback`| `GET` | State JWT | Completes GitHub App installation callback |
| `/api/v1/cli/auth` | `GET` | Bearer Key | Validates SHA-256 hashed API key for CLI/CI |
| `/api/v1/keys` | `GET/POST`| Session | Lists or generates new `aur_live_...` API keys |
| `/api/v1/releases/publish` | `POST` | Bearer/Session | Publishes OpenAPI specs and dispatches PRs |
| `/api/v1/repos/scan` | `POST` | Session | Scans repository AST and updates subscriptions |
| `/api/v1/migrations/execute` | `POST` | Session | Triggers autonomous E2B sandbox verification & opens PR |
| `/api/v1/dashboard/data` | `GET` | Session | Fetches real-time dashboard data |

---

## 🛡️ License
Private & Proprietary — Sovereign Protocol Architecture.
