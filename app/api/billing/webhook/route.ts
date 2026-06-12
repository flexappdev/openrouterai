import { NextResponse, type NextRequest } from "next/server";
import { verifyWebhookSignature } from "@/lib/stripe";
import { recordCredit } from "@/lib/mongo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CheckoutSession = {
  id: string;
  customer_email?: string;
  amount_total?: number;
  metadata?: Record<string, string>;
};

type StripeEvent = {
  type: string;
  data?: { object?: CheckoutSession };
};

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "webhook_unconfigured" }, { status: 503 });
  }

  const sigHeader = request.headers.get("stripe-signature");
  const payload = await request.text();

  const ok = await verifyWebhookSignature(payload, sigHeader, secret);
  if (!ok) {
    return NextResponse.json({ error: "bad_signature" }, { status: 400 });
  }

  let event: StripeEvent;
  try {
    event = JSON.parse(payload) as StripeEvent;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data?.object;
    const email =
      session?.metadata?.owner_email ??
      session?.customer_email ??
      "";
    const amountUsd = (session?.amount_total ?? 0) / 100;

    if (email && amountUsd > 0) {
      await recordCredit({
        ts: new Date(),
        owner_email: email,
        type: "purchase",
        amount_usd: amountUsd,
        method: "stripe",
        stripe_session_id: session?.id,
      });
    }
  }

  return NextResponse.json({ received: true });
}
