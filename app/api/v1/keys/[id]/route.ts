import { NextResponse, type NextRequest } from "next/server";
import { requireUser } from "@/lib/session";
import { updateKey, deleteKey } from "@/lib/mongo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  let body: { disabled?: boolean; name?: string; limit_usd?: number | null };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  const patch: { disabled?: boolean; name?: string; limit_usd?: number | null } = {};
  if (typeof body.disabled === "boolean") patch.disabled = body.disabled;
  if (typeof body.name === "string") patch.name = body.name.trim();
  if (body.limit_usd === null || typeof body.limit_usd === "number")
    patch.limit_usd = body.limit_usd;

  const ok = await updateKey(id, user.email, patch);
  if (!ok) return NextResponse.json({ error: "not_found_or_unreachable" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const ok = await deleteKey(id, user.email);
  if (!ok) return NextResponse.json({ error: "not_found_or_unreachable" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
