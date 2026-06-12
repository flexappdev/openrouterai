import { NextResponse, type NextRequest } from "next/server";
import { requireUser } from "@/lib/session";
import { createCheckoutSession, isStripeConfigured } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        error: "stripe_unconfigured",
        message:
          "Set STRIPE_SECRET_KEY in env to enable purchases (see README).",
      },
      { status: 503 }
    );
  }

  let body: { amount_usd?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const amount = Number(body.amount_usd);
  if (!Number.isFinite(amount) || amount < 5 || amount > 5000) {
    return NextResponse.json({ error: "amount_out_of_range" }, { status: 400 });
  }

  const origin =
    request.headers.get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "https://openrouterai.vercel.app";

  const session = await createCheckoutSession({
    amountCents: Math.round(amount * 100),
    customerEmail: user.email,
    successUrl: `${origin}/settings/credits?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${origin}/settings/credits?cancelled=1`,
    metadata: { owner_email: user.email },
  });

  if (!session) {
    return NextResponse.json({ error: "stripe_create_failed" }, { status: 502 });
  }

  return NextResponse.json({ url: session.url, id: session.id });
}
