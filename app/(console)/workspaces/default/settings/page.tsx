"use client";

import { useState } from "react";

export default function WorkspaceSettingsPage() {
  const [name, setName] = useState("default");
  const [budget, setBudget] = useState("750");
  const [members] = useState([
    { email: "mat@cleverfox.ai", role: "Owner" },
  ]);
  const [saved, setSaved] = useState(false);

  return (
    <>
      <h1 className="font-display" style={{ fontSize: 34, margin: "0 0 6px" }}>Workspace Settings</h1>
      <p style={{ color: "var(--muted-foreground)", margin: "0 0 24px" }}>
        Workspace <span className="font-mono" style={{ fontSize: 12 }}>ws_default</span>
      </p>

      <div className="card" style={{ maxWidth: 640, padding: 24, display: "grid", gap: 18, marginBottom: 20 }}>
        <div>
          <div className="label" style={{ marginBottom: 6 }}>Workspace name</div>
          <input className="input" style={{ maxWidth: 280 }} value={name} onChange={(e) => { setName(e.target.value); setSaved(false); }} />
        </div>
        <div>
          <div className="label" style={{ marginBottom: 6 }}>Monthly budget ($)</div>
          <input className="input" style={{ maxWidth: 160 }} value={budget} onChange={(e) => { setBudget(e.target.value.replace(/[^0-9]/g, "")); setSaved(false); }} />
          <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "6px 0 0" }}>
            All keys in this workspace are paused once combined spend reaches the budget.
          </p>
        </div>
        <div>
          <button className="btn-primary" onClick={() => setSaved(true)}>{saved ? "Saved ✓" : "Save"}</button>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 640, padding: 24, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 15 }}>Members</h3>
          <button className="btn-secondary" style={{ fontSize: 12 }}>Invite member</button>
        </div>
        {members.map((m) => (
          <div key={m.email} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "8px 0" }}>
            <span>{m.email}</span>
            <span className="label">{m.role}</span>
          </div>
        ))}
      </div>

      <div className="card" style={{ maxWidth: 640, padding: 24, borderColor: "rgba(239,68,68,0.35)" }}>
        <h3 style={{ margin: "0 0 6px", fontSize: 15, color: "var(--destructive)" }}>Delete workspace</h3>
        <p style={{ margin: "0 0 14px", fontSize: 13, color: "var(--muted-foreground)" }}>
          Revokes all keys and removes usage history. The default workspace cannot be deleted.
        </p>
        <button className="btn-secondary" style={{ color: "var(--destructive)", borderColor: "rgba(239,68,68,0.4)", opacity: 0.6, cursor: "not-allowed" }}>
          Delete workspace
        </button>
      </div>
    </>
  );
}
