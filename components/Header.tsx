"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Sun, Moon, ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/auth";

const NAV = [
  { href: "/models", label: "Models" },
  { href: "/rankings", label: "Rankings" },
  { href: "/apps", label: "Apps" },
  { href: "/enterprise", label: "Enterprise" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs/quickstart", label: "Docs" },
];

export default function Header() {
  const pathname = usePathname();
  const { user, signIn, signOut } = useAuth();
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const saved = (typeof window !== "undefined" && window.localStorage.getItem("orai-theme")) as
      | "dark"
      | "light"
      | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem("orai-theme", next);
    } catch {}
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "var(--background)",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "0 24px",
          height: 60,
          display: "flex",
          alignItems: "center",
          gap: 28,
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 26,
              height: 26,
              borderRadius: 7,
              background: "var(--primary)",
              color: "var(--primary-foreground)",
              display: "grid",
              placeItems: "center",
              fontWeight: 800,
              fontSize: 14,
            }}
          >
            ◎
          </span>
          <span style={{ fontWeight: 700, fontSize: 15 }}>
            OpenRouter<span style={{ color: "var(--primary)" }}>ai</span>
          </span>
        </Link>

        <nav style={{ display: "flex", gap: 4, flex: 1 }}>
          {NAV.map((n) => {
            const active = pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  color: active ? "var(--foreground)" : "var(--muted-foreground)",
                  background: active ? "var(--surface-2)" : "transparent",
                }}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <button onClick={toggle} className="btn-secondary" style={{ padding: 7 }} aria-label="Toggle theme">
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {user ? (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setMenu(!menu)}
              className="btn-secondary"
              style={{ gap: 8, paddingLeft: 8 }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 999,
                  background: "var(--primary)",
                  color: "var(--primary-foreground)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {user.avatar}
              </span>
              {user.name}
              <ChevronDown size={14} />
            </button>
            {menu && (
              <div
                className="card"
                style={{
                  position: "absolute",
                  right: 0,
                  top: 42,
                  width: 220,
                  padding: 6,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
                }}
                onClick={() => setMenu(false)}
              >
                {[
                  ["/workspaces", "Workspaces"],
                  ["/workspaces/default/keys", "API Keys"],
                  ["/activity", "Activity"],
                  ["/logs", "Logs"],
                  ["/settings/credits", "Credits"],
                  ["/settings/profile", "Settings"],
                ].map(([href, label]) => (
                  <Link
                    key={href}
                    href={href}
                    style={{
                      display: "block",
                      padding: "8px 10px",
                      borderRadius: 8,
                      fontSize: 13,
                      color: "var(--secondary-foreground)",
                    }}
                  >
                    {label}
                  </Link>
                ))}
                <div style={{ height: 1, background: "var(--border-subtle)", margin: "6px 0" }} />
                <button
                  onClick={signOut}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 10px",
                    borderRadius: 8,
                    fontSize: 13,
                    background: "none",
                    border: "none",
                    color: "var(--destructive)",
                    cursor: "pointer",
                  }}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={signIn} className="btn-primary">
            Sign in
          </button>
        )}
      </div>
    </header>
  );
}
