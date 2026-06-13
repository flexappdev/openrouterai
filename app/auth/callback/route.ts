import { NextResponse, type NextRequest } from "next/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_EMAIL = (
  process.env.ADMIN_EMAIL ?? "mat@matsiems.com"
).toLowerCase();

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const next = url.searchParams.get("next") ?? "/workspaces";

  const supabase = await createClient();

  // 1. OAuth callback (PKCE flow — Google etc.)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(new URL("/login?error=callback", request.url));
    }
  }
  // 2. Magic-link / email OTP callback
  else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (error) {
      return NextResponse.redirect(new URL("/login?error=callback", request.url));
    }
  } else {
    return NextResponse.redirect(new URL("/login?error=callback", request.url));
  }

  // Allowlist check at the door — fail closed.
  const { data } = await supabase.auth.getSession();
  const email = data.session?.user?.email?.toLowerCase() ?? "";
  if (email !== ALLOWED_EMAIL) {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    return NextResponse.redirect(
      new URL("/login?error=not_allowlisted", request.url)
    );
  }

  return NextResponse.redirect(new URL(next, request.url));
}
