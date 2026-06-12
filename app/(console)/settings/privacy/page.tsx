"use client";

import { useState } from "react";

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 42, height: 24, borderRadius: 999, border: "none", cursor: "pointer",
        background: on ? "var(--primary)" : "var(--surface-2)", position: "relative",
        transition: "background 0.15s", flexShrink: 0,
      }}
      aria-pressed={on}
    >
      <span style={{ position: "absolute", top: 3, left: on ? 21 : 3, width: 18, height: 18, borderRadius: 999, background: "#fff", transition: "left 0.15s" }} />
    </button>
  );
}

const ROWS = [
  { key: "logging", title: "Prompt & completion logging", desc: "Store request bodies in Logs for debugging. Disable for metadata-only logging." },
  { key: "training", title: "Allow training-eligible providers", desc: "Permit routing to providers that may use inputs for model improvement, often at a discount." },
  { key: "free", title: "Enable free-tier models", desc: "Allow routing to free endpoints, which typically have weaker data-handling guarantees." },
  { key: "analytics", title: "Anonymous product analytics", desc: "Share anonymised UI usage to help improve the dashboard." },
];

export default function PrivacyPage() {
  const [state, setState] = useState<Record<string, boolean>>({ logging: true, training: false, free: false, analytics: true });

  return (
    <>
      <h1 className="font-display" style={{ fontSize: 34, margin: "0 0 6px" }}>Privacy</h1>
      <p style={{ color: "var(--muted-foreground)", margin: "0 0 24px", maxWidth: 560 }}>
        These controls apply account-wide. Requests are blocked from any provider that
        doesn&apos;t meet your selected policy.
      </p>

      <div className="card" style={{ maxWidth: 680, overflow: "hidden" }}>
        {ROWS.map((r, i) => (
          <div
            key={r.key}
            style={{
              display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24,
              padding: "18px 22px",
              borderBottom: i < ROWS.length - 1 ? "1px solid var(--border-subtle)" : "none",
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{r.title}</div>
              <div style={{ fontSize: 12.5, color: "var(--muted-foreground)", marginTop: 2 }}>{r.desc}</div>
            </div>
            <Toggle on={state[r.key]} onClick={() => setState({ ...state, [r.key]: !state[r.key] })} />
          </div>
        ))}
      </div>

      <div className="card" style={{ maxWidth: 680, padding: 20, marginTop: 20 }}>
        <div className="label" style={{ marginBottom: 8 }}>Data retention</div>
        <select className="input" style={{ maxWidth: 240 }} defaultValue="30">
          <option value="0">Do not retain logs</option>
          <option value="7">7 days</option>
          <option value="30">30 days</option>
          <option value="90">90 days</option>
        </select>
        <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "10px 0 0" }}>
          Applies to request logs only. Billing records are kept as required by law.
        </p>
      </div>
    </>
  );
}
