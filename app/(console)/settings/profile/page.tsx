"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";

export default function ProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [org, setOrg] = useState("Cleverfox AI");
  const [saved, setSaved] = useState(false);

  return (
    <>
      <h1 className="font-display" style={{ fontSize: 34, margin: "0 0 24px" }}>Profile</h1>

      <div className="card" style={{ padding: 24, maxWidth: 560, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <span
            style={{
              width: 52, height: 52, borderRadius: 999, background: "var(--primary)",
              color: "var(--primary-foreground)", display: "grid", placeItems: "center",
              fontSize: 22, fontWeight: 700,
            }}
          >
            {user?.avatar}
          </span>
          <div>
            <div style={{ fontWeight: 600 }}>{user?.email}</div>
            <div className="font-mono" style={{ fontSize: 11, color: "var(--muted-foreground)" }}>
              Connected via Google · since Nov 2025
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          <div>
            <div className="label" style={{ marginBottom: 6 }}>Display name</div>
            <input className="input" value={name} onChange={(e) => { setName(e.target.value); setSaved(false); }} />
          </div>
          <div>
            <div className="label" style={{ marginBottom: 6 }}>Organisation</div>
            <input className="input" value={org} onChange={(e) => { setOrg(e.target.value); setSaved(false); }} />
          </div>
          <div>
            <button className="btn-primary" onClick={() => setSaved(true)}>
              {saved ? "Saved ✓" : "Save changes"}
            </button>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 24, maxWidth: 560, borderColor: "rgba(239,68,68,0.35)" }}>
        <h3 style={{ margin: "0 0 6px", fontSize: 15, color: "var(--destructive)" }}>Danger zone</h3>
        <p style={{ margin: "0 0 14px", fontSize: 13, color: "var(--muted-foreground)" }}>
          Deleting your account removes all workspaces, keys, and remaining credits.
        </p>
        <button className="btn-secondary" style={{ color: "var(--destructive)", borderColor: "rgba(239,68,68,0.4)" }}>
          Delete account
        </button>
      </div>
    </>
  );
}
