import { NextResponse } from "next/server";
import { recentLogs } from "@/lib/mongo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await recentLogs(100);
  return NextResponse.json({ data: rows });
}
