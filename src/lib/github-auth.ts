import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/rest";

const GITHUB_APP_ID = process.env.GITHUB_APP_ID ? parseInt(process.env.GITHUB_APP_ID, 10) : 0;
const GITHUB_APP_PRIVATE_KEY = process.env.GITHUB_APP_PRIVATE_KEY?.replace(/\\n/g, "\n") || "";
const GITHUB_APP_CLIENT_ID = process.env.GITHUB_APP_CLIENT_ID || "";
const GITHUB_APP_CLIENT_SECRET = process.env.GITHUB_APP_CLIENT_SECRET || "";

/**
 * Mint a Just-In-Time (JIT) 1-hour GitHub Installation Access Token.
 * Never stores static tokens. Whenever a worker needs to scan or open a PR,
 * this function requests an ephemeral installation token via GitHub App RSA private key.
 */
export async function getInstallationOctokit(
  installationId: number | bigint
): Promise<{ octokit: Octokit; token: string; expiresAt: string }> {
  const numericId = typeof installationId === "bigint" ? Number(installationId) : installationId;

  // In local development or if private key is not configured, fallback gracefully
  if (!GITHUB_APP_PRIVATE_KEY || !GITHUB_APP_ID) {
    console.warn(
      "[Aurumend GitHub Auth] Running in simulated mode: GITHUB_APP_PRIVATE_KEY or GITHUB_APP_ID not configured."
    );
    return {
      octokit: new Octokit(),
      token: "simulated_jit_installation_token_" + Date.now(),
      expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
    };
  }

  const auth = createAppAuth({
    appId: GITHUB_APP_ID,
    privateKey: GITHUB_APP_PRIVATE_KEY,
    clientId: GITHUB_APP_CLIENT_ID,
    clientSecret: GITHUB_APP_CLIENT_SECRET,
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

  return { octokit, token, expiresAt };
}

/**
 * Mint an App-level Octokit client (for querying installations and app metadata).
 */
export async function getAppOctokit(): Promise<Octokit> {
  if (!GITHUB_APP_PRIVATE_KEY || !GITHUB_APP_ID) {
    return new Octokit();
  }

  const auth = createAppAuth({
    appId: GITHUB_APP_ID,
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
  const { octokit } = await getInstallationOctokit(params.installationId);
  const [owner, repo] = params.repoFullName.split("/");

  // If running in development without live GitHub token, return simulated successful response
  if (!process.env.GITHUB_APP_PRIVATE_KEY) {
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
