import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/rest";

function isPlaceholder(value: string | undefined): boolean {
  if (!value) return true;
  const v = value.trim();
  if (!v) return true;
  if (v === "123456" || v === "0") return true;
  if (/^x+$/i.test(v) || v.includes("xxxxxxxx")) return true;
  if (v.includes("MIIEowIBAAKCAQEA0")) return true;
  if (v.includes("Iv1.xxxx")) return true;
  if (v.startsWith("your-") || v.includes("paste-")) return true;
  return false;
}

const rawAppId = process.env.GITHUB_APP_ID?.trim() || "";
const rawPrivateKey = process.env.GITHUB_APP_PRIVATE_KEY?.replace(/\\n/g, "\n").trim() || "";
const rawClientId = process.env.GITHUB_APP_CLIENT_ID?.trim() || process.env.NEXT_PUBLIC_GITHUB_APP_CLIENT_ID?.trim() || "";
const rawClientSecret = process.env.GITHUB_APP_CLIENT_SECRET?.trim() || "";

const GITHUB_APP_ID = !isPlaceholder(rawAppId) ? parseInt(rawAppId, 10) : 0;
const GITHUB_APP_PRIVATE_KEY = !isPlaceholder(rawPrivateKey) ? rawPrivateKey : "";
const GITHUB_APP_CLIENT_ID = !isPlaceholder(rawClientId) ? rawClientId : "";
const GITHUB_APP_CLIENT_SECRET = !isPlaceholder(rawClientSecret) ? rawClientSecret : "";

export function isGitHubAppLive(): boolean {
  return Boolean((GITHUB_APP_ID || GITHUB_APP_CLIENT_ID) && GITHUB_APP_PRIVATE_KEY.includes("PRIVATE KEY"));
}

/**
 * Mint a Just-In-Time (JIT) 1-hour GitHub Installation Access Token.
 * Never stores static tokens. Whenever a worker needs to scan or open a PR,
 * this function requests an ephemeral installation token via GitHub App RSA private key.
 */
export async function getInstallationOctokit(
  installationId: number | bigint
): Promise<{ octokit: Octokit; token: string; expiresAt: string; simulated: boolean }> {
  const numericId = typeof installationId === "bigint" ? Number(installationId) : installationId;

  // Local demo mode never calls api.github.com with placeholder credentials.
  if (!isGitHubAppLive()) {
    console.warn(
      "[Aurumend GitHub Auth] Simulated mode. Add a real GITHUB_APP_ID and GITHUB_APP_PRIVATE_KEY to open live pull requests."
    );
    return {
      octokit: new Octokit(),
      token: "simulated_jit_installation_token_" + Date.now(),
      expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
      simulated: true,
    };
  }

  const auth = createAppAuth({
    appId: GITHUB_APP_ID || GITHUB_APP_CLIENT_ID,
    privateKey: GITHUB_APP_PRIVATE_KEY,
    ...(GITHUB_APP_CLIENT_ID && GITHUB_APP_CLIENT_SECRET
      ? { clientId: GITHUB_APP_CLIENT_ID, clientSecret: GITHUB_APP_CLIENT_SECRET }
      : {}),
  });

  // Mint an installation token scoped to this specific customer installation
  const installationAuthentication = await auth({
    type: "installation",
    installationId: numericId,
  });

  const token = installationAuthentication.token;
  const expiresAt = installationAuthentication.expiresAt;

  const octokit = new Octokit({
    auth: token,
  });

  return { octokit, token, expiresAt, simulated: false };
}

/**
 * Mint an App-level Octokit client (for querying installations and app metadata).
 */
export async function getAppOctokit(): Promise<Octokit> {
  if (!isGitHubAppLive()) {
    return new Octokit();
  }

  const auth = createAppAuth({
    appId: GITHUB_APP_ID || GITHUB_APP_CLIENT_ID,
    privateKey: GITHUB_APP_PRIVATE_KEY,
  });

  const appAuth = await auth({ type: "app" });
  return new Octokit({ auth: appAuth.token });
}

export interface CreatePullRequestParams {
  installationId: number | bigint;
  repoFullName: string; // e.g. "acme-corp/payment-service"
  baseBranch?: string; // defaults to "main"
  targetBranch: string; // e.g. "aurumend/migrate-stripe-v2025-04"
  prTitle: string;
  prBody: string;
  fileChanges: Array<{
    path: string;
    content: string; // complete new content
    commitMessage?: string;
  }>;
}

/**
 * Autonomously opens a contract-verified Pull Request on the customer's repository.
 */
export async function createContractVerifiedPullRequest(
  params: CreatePullRequestParams
): Promise<{ prNumber: number; prUrl: string; sha: string }> {
  const { octokit, simulated } = await getInstallationOctokit(params.installationId);
  const [owner, repo] = params.repoFullName.split("/");

  if (simulated) {
    const mockPrNumber = Math.floor(Math.random() * 800) + 100;
    return {
      prNumber: mockPrNumber,
      prUrl: `https://github.com/${params.repoFullName}/pull/${mockPrNumber}`,
      sha: "sha_" + Math.random().toString(36).substring(2, 10),
    };
  }

  // 1. Get default branch reference
  const repoData = await octokit.rest.repos.get({ owner, repo });
  const base = params.baseBranch || repoData.data.default_branch || "main";

  const { data: baseRef } = await octokit.rest.git.getRef({
    owner,
    repo,
    ref: `heads/${base}`,
  });
  const baseSha = baseRef.object.sha;

  // 2. Create target branch or update existing branch
  try {
    await octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${params.targetBranch}`,
      sha: baseSha,
    });
  } catch (err: any) {
    if (err.status !== 422) throw err;
    // branch already exists, update ref
    await octokit.rest.git.updateRef({
      owner,
      repo,
      ref: `heads/${params.targetBranch}`,
      sha: baseSha,
      force: true,
    });
  }

  // 3. Commit file transformations
  let latestSha = baseSha;
  for (const file of params.fileChanges) {
    let existingSha: string | undefined;
    try {
      const { data: existingFile } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: file.path,
        ref: params.targetBranch,
      });
      if ("sha" in existingFile) {
        existingSha = existingFile.sha;
      }
    } catch {
      // file is newly created
    }

    const { data: commitResult } = await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: file.path,
      message: file.commitMessage || `[Aurumend] Self-heal: refactor ${file.path}`,
      content: Buffer.from(file.content).toString("base64"),
      branch: params.targetBranch,
      sha: existingSha,
    });

    latestSha = commitResult.commit.sha || baseSha;
  }

  // 4. Create Pull Request
  const { data: pr } = await octokit.rest.pulls.create({
    owner,
    repo,
    title: params.prTitle,
    head: params.targetBranch,
    base,
    body: params.prBody,
  });

  return {
    prNumber: pr.number,
    prUrl: pr.html_url,
    sha: latestSha,
  };
}
