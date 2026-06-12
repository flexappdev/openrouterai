import { NextResponse, type NextRequest } from "next/server";
import { createHash, randomBytes } from "node:crypto";
import { requireUser } from "@/lib/session";
import { createKey, listKeys, type StoredApiKey } from "@/lib/mongo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function newRawKey(): string {
  return `sk-or-v1-${randomBytes(16).toString("hex")}`;
}

function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const rows = await listKeys(user.email);
  return NextResponse.json({ data: rows });
}

export async function POST(request: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  let body: { name?: string; limit_usd?: number | null };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  const name = (body.name ?? "").trim();
  if (!name) return NextResponse.json({ error: "name_required" }, { status: 400 });

  const raw = newRawKey();
  const stored: StoredApiKey = {
    id: `k_${Date.now().toString(36)}_${randomBytes(3).toString("hex")}`,
    owner_email: user.email,
    name,
    hash: sha256(raw),
    prefix: raw.slice(0, 12),
    suffix: raw.slice(-4),
    created: new Date().toISOString().slice(0, 10),
    last_used: "—",
    limit_usd: typeof body.limit_usd === "number" ? body.limit_usd : null,
    spend_mtd_usd: 0,
    disabled: false,
  };

  const ok = await createKey(stored);
  if (!ok) {
    return NextResponse.json(
      { error: "store_failed", reason: "Mongo unreachable" },
      { status: 503 }
    );
  }

  // Return raw key once — caller must save it
  return NextResponse.json({
    key: raw,
    record: { ...stored, hash: undefined },
  });
}
