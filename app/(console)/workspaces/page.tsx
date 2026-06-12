"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { SEED_KEYS, ACTIVITY_DAYS, fmtMoney } from "@/lib/data";
import { KeyRound, Activity, CreditCard } from "lucide-react";

export default function WorkspacesPage() {
  const { user } = useAuth();
  const spendMtd = ACTIVITY_DAYS.slice(-12).reduce((s, d) => s + d.spend, 0);

  return (
    <>
      <h1 className="font-display" style={{ fontSize: 34, margin: "0 0 6px" }}>
        Workspaces
      </h1>
      <p style={{ color: "var(--muted-foreground)", margin: "0 0 28px" }}>
        Signed in as {user?.email}
      </p>

      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 17 }}>default</h2>
            <span className="font-mono" style={{ fontSize: 11, color: "var(--muted-foreground)" }}>
              ws_default · owner
            </span>
          </div>
          <Link href="/workspaces/default/settings" className="btn-secondary" style={{ fontSize: 12 }}>
            Settings
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          {[
            { k: "Active keys", v: String(SEED_KEYS.filter((x) => !x.disabled).length), href: "/workspaces/default/keys", icon: <KeyRound size={14} /> },
            { k: "Spend (30d)", v: fmtMoney(spendMtd), href: "/activity", icon: <Activity size={14} /> },
            { k: "Credit balance", v: "$161.71", href: "/settings/credits", icon: <CreditCard size={14} /> },
          ].map((s) => (
            <Link key={s.k} href={s.href} className="card" style={{ padding: 16, background: "var(--surface-2)", border: "none" }}>
              <div className="label" style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 8 }}>
                {s.icon} {s.k}
              </div>
              <div className="font-mono" style={{ fontSize: 22, fontWeight: 600 }}>{s.v}</div>
            </Link>
          ))}
        </div>
      </div>

      <button className="btn-secondary">+ New workspace</button>
    </>
  );
}
