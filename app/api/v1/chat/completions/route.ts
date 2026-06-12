import { NextResponse, type NextRequest } from "next/server";
import { logRequest } from "@/lib/mongo";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

const UPSTREAM = "https://openrouter.ai/api/v1/chat/completions";
const ATTRIBUTION_REFERER =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://openrouterai.vercel.app";

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: { message: "OPENROUTER_API_KEY not configured" } },
      { status: 503 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { message: "Invalid JSON body" } },
      { status: 400 }
    );
  }

  if (!body.model) {
    body.model = process.env.OPENROUTER_MODEL ?? "anthropic/claude-sonnet-4-6";
  }

  const upstreamAuth = request.headers.get("authorization");
  const userKeyHash = upstreamAuth
    ? upstreamAuth.replace(/^Bearer\s+/i, "").slice(-8)
    : "anon";

  const started = Date.now();
  const isStream = Boolean(body.stream);

  let upstream: Response;
  try {
    upstream = await fetch(UPSTREAM, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": ATTRIBUTION_REFERER,
        "X-Title": "OpenRouterai",
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upstream fetch failed";
    return NextResponse.json(
      { error: { message } },
      { status: 502 }
    );
  }

  if (!upstream.ok) {
    const text = await upstream.text();
    logRequest({
      key_hash: userKeyHash,
      model: String(body.model),
      status: "error",
      latency_ms: Date.now() - started,
      error_code: upstream.status,
    }).catch(() => {});
    return new NextResponse(text, {
      status: upstream.status,
      headers: { "Content-Type": upstream.headers.get("Content-Type") ?? "application/json" },
    });
  }

  if (isStream && upstream.body) {
    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  }

  const text = await upstream.text();
  let usage: { prompt_tokens?: number; completion_tokens?: number } = {};
  try {
    const parsed = JSON.parse(text) as { usage?: typeof usage };
    if (parsed.usage) usage = parsed.usage;
  } catch {
    // ignore
  }

  logRequest({
    key_hash: userKeyHash,
    model: String(body.model),
    status: "200",
    latency_ms: Date.now() - started,
    prompt_tokens: usage.prompt_tokens,
    completion_tokens: usage.completion_tokens,
  }).catch(() => {});

  return new NextResponse(text, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
