import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { indexCustomerRepository } from "@/lib/ast-indexer";
import { db } from "@/db";
import { githubInstallations, repoApiSubscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getInstallationOctokit } from "@/lib/github-auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json().catch(() => ({}));
    const repoFullName = body.repoFullName || "acme-corp/payment-service";

    // 1. Find GitHub installation for this org
    let installation = await db.query.githubInstallations.findFirst({
      where: eq(githubInstallations.orgId, session.orgId),
    });

    const installationId = installation?.githubInstallationId || BigInt(12345678);

    // 2. Obtain files: Either passed directly in body or fetched via GitHub API
    let files: Record<string, string> = body.files;

    if (!files || Object.keys(files).length === 0) {
      // Default sample codebase with realistic Stripe and OpenAI usage
      files = {
        "src/services/payment.ts": `
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function processOrderPayment(order: { id: string; totalCents: number; customerToken: string }) {
  console.log('Charging customer token for order:', order.id);
  const charge = await stripe.charges.create({
    amount: order.totalCents,
    currency: 'usd',
    source: order.customerToken,
    description: \`Payment for Order \${order.id}\`,
  });
  return charge;
}
`,
        "src/app/api/webhooks/stripe/route.ts": `
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') || '';
  const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);

  if (event.type === 'charge.succeeded') {
    const charge = event.data.object;
    console.log('Order paid successfully:', charge.id);
  }

  return NextResponse.json({ received: true });
}
`,
        "src/services/ai-assistant.ts": `
import OpenAI from 'openai';

const openai = new OpenAI();

export async function extractProductDetails(prompt: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
  });
  return response.choices[0].message.content;
}
`,
      };
    }

    // 3. Run AST indexing engine
    const result = await indexCustomerRepository({
      orgId: session.orgId,
      installationId,
      repoFullName,
      files,
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    console.error("[Repo Scan Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
