// Lightweight Stripe HTTP wrapper. We don't import the `stripe` SDK to avoid a
// 6MB dependency for what's effectively two endpoints. Both functions are
// env-guarded — they return null/false when STRIPE_SECRET_KEY is missing,
// letting the route handlers respond 503 cleanly.

const STRIPE_API = "https://api.stripe.com/v1";

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

type CheckoutInput = {
  amountCents: number;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
};

export async function createCheckoutSession(
  input: CheckoutInput
): Promise<{ id: string; url: string } | null> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;

  const body = new URLSearchParams();
  body.append("mode", "payment");
  body.append("payment_method_types[]", "card");
  body.append("line_items[0][quantity]", "1");
  body.append("line_items[0][price_data][currency]", "usd");
  body.append("line_items[0][price_data][unit_amount]", String(input.amountCents));
  body.append("line_items[0][price_data][product_data][name]", "OpenRouterai credits");
  body.append("customer_email", input.customerEmail);
  body.append("success_url", input.successUrl);
  body.append("cancel_url", input.cancelUrl);
  for (const [k, v] of Object.entries(input.metadata ?? {})) {
    body.append(`metadata[${k}]`, v);
  }

  const res = await fetch(`${STRIPE_API}/checkout/sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { id: string; url: string };
  return { id: json.id, url: json.url };
}

// Manual signature verification (no `stripe` SDK).
// Stripe-Signature header format: t=<ts>,v1=<sig>[,v0=...]
export async function verifyWebhookSignature(
  payload: string,
  header: string | null,
  secret: string,
  toleranceSec = 300
): Promise<boolean> {
  if (!header) return false;
  const parts = Object.fromEntries(
    header.split(",").map((p) => {
      const [k, v] = p.split("=");
      return [k.trim(), v.trim()];
    })
  );
  const ts = parts.t;
  const sig = parts.v1;
  if (!ts || !sig) return false;
  if (Math.abs(Date.now() / 1000 - Number(ts)) > toleranceSec) return false;

  const crypto = await import("node:crypto");
  const signedPayload = `${ts}.${payload}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(signedPayload, "utf8")
    .digest("hex");

  // constant-time compare
  if (expected.length !== sig.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig));
}
