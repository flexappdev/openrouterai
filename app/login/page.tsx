"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.28-1.93-6.14-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.86 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.36-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.94l3.68-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.07.56 4.21 1.65l3.15-3.15A11 11 0 0 0 12 1 11 11 0 0 0 2.18 7.07l3.68 2.83C6.72 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

function LoginInner() {
  const params = useSearchParams();
  const error = params.get("error");
  const next = params.get("next") ?? "/workspaces";
  const [pending, setPending] = useState(false);
  const [missingEnv, setMissingEnv] = useState(false);

  useEffect(() => {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      setMissingEnv(true);
    }
  }, []);

  const signInWithGoogle = async () => {
    if (missingEnv) return;
    setPending(true);
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
  };

  return (
    <main style={{ maxWidth: 420, margin: "120px auto", padding: "0 24px" }}>
      <div className="card" style={{ padding: 32 }}>
        <h1 className="font-display" style={{ fontSize: 28, margin: "0 0 8px" }}>
          Sign in
        </h1>
        <p style={{ color: "var(--muted-foreground)", margin: "0 0 24px", fontSize: 14 }}>
          OpenRouterai is a single-user preview. Console access is restricted to{" "}
          <span className="font-mono">mat@matsiems.com</span>.
        </p>

        {error === "not_allowlisted" && (
          <div
            style={{
              padding: 12,
              borderRadius: 8,
              background: "var(--destructive)",
              color: "#fff",
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            That Google account isn&apos;t on the allowlist.
          </div>
        )}
        {error === "unconfigured" && (
          <div
            style={{
              padding: 12,
              borderRadius: 8,
              background: "var(--warning-muted)",
              color: "var(--warning)",
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            Auth is not configured on this deployment. Set
            <span className="font-mono"> NEXT_PUBLIC_SUPABASE_URL</span> and
            <span className="font-mono"> NEXT_PUBLIC_SUPABASE_ANON_KEY</span>.
          </div>
        )}
        {error === "callback" && (
          <div
            style={{
              padding: 12,
              borderRadius: 8,
              background: "var(--destructive)",
              color: "#fff",
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            Couldn&apos;t complete sign-in. Try again.
          </div>
        )}

        <button
          onClick={signInWithGoogle}
          disabled={pending || missingEnv}
          className="btn-secondary"
          style={{
            width: "100%",
            padding: "11px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            fontSize: 14,
            fontWeight: 500,
            opacity: pending || missingEnv ? 0.6 : 1,
          }}
        >
          <GoogleMark />
          {pending ? "Redirecting…" : "Continue with Google"}
        </button>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
