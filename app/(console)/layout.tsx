"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { KeyRound, Activity, ScrollText, CreditCard, User, Shield, Sliders, Boxes, Settings } from "lucide-react";

const SECTIONS = [
  {
    title: "Workspace",
    items: [
      { href: "/workspaces", label: "Overview", icon: <Boxes size={15} /> },
      { href: "/workspaces/default/keys", label: "API Keys", icon: <KeyRound size={15} /> },
      { href: "/workspaces/default/settings", label: "Workspace Settings", icon: <Settings size={15} /> },
    ],
  },
  {
    title: "Usage",
    items: [
      { href: "/activity", label: "Activity", icon: <Activity size={15} /> },
      { href: "/logs", label: "Logs", icon: <ScrollText size={15} /> },
    ],
  },
  {
    title: "Account",
    items: [
      { href: "/settings/profile", label: "Profile", icon: <User size={15} /> },
      { href: "/settings/credits", label: "Credits", icon: <CreditCard size={15} /> },
      { href: "/settings/privacy", label: "Privacy", icon: <Shield size={15} /> },
      { href: "/settings/preferences", label: "Preferences", icon: <Sliders size={15} /> },
    ],
  },
];

function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.96 10.96 0 0 0 12 1 11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
    </svg>
  );
}

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  const { user, signIn, ready } = useAuth();
  const pathname = usePathname();

  if (!ready) return <main style={{ minHeight: "60vh" }} />;

  if (!user) {
    return (
      <main style={{ display: "grid", placeItems: "center", minHeight: "70vh", padding: 24 }}>
        <div className="card" style={{ padding: 40, width: 380, textAlign: "center" }}>
          <h1 className="font-display" style={{ fontSize: 30, margin: "0 0 8px" }}>
            Sign in
          </h1>
          <p style={{ fontSize: 13, color: "var(--muted-foreground)", margin: "0 0 24px" }}>
            Access your workspaces, keys, and usage.
          </p>
          <button onClick={signIn} className="btn-secondary" style={{ width: "100%", justifyContent: "center", padding: "11px 0", fontSize: 14 }}>
            <GoogleMark /> Continue with Google
          </button>
          <p style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 18 }}>
            Demo build — sign-in is mocked locally.
          </p>
        </div>
      </main>
    );
  }

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px", display: "flex", gap: 32 }}>
      <aside
        style={{
          width: 220,
          flexShrink: 0,
          padding: "32px 0",
          borderRight: "1px solid var(--border-subtle)",
          minHeight: "calc(100vh - 60px)",
        }}
      >
        {SECTIONS.map((s) => (
          <div key={s.title} style={{ marginBottom: 24 }}>
            <div className="label" style={{ padding: "0 12px 8px" }}>{s.title}</div>
            {s.items.map((it) => {
              const active = pathname === it.href;
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 12px",
                    marginRight: 16,
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: active ? 600 : 400,
                    color: active ? "var(--foreground)" : "var(--muted-foreground)",
                    background: active ? "var(--surface-2)" : "transparent",
                  }}
                >
                  {it.icon}
                  {it.label}
                </Link>
              );
            })}
          </div>
        ))}
      </aside>
      <main style={{ flex: 1, padding: "40px 0 96px", minWidth: 0 }}>{children}</main>
    </div>
  );
}
