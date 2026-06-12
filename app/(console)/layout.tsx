"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
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

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [ready, user, pathname, router]);

  if (!ready || !user) return <main style={{ minHeight: "60vh" }} />;

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
