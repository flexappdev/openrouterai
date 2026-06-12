"use client";

import { useState } from "react";
import { ACTIVITY_DAYS, fmtMoney } from "@/lib/data";

type Metric = "spend" | "requests" | "tokens";

export default function ActivityPage() {
  const [metric, setMetric] = useState<Metric>("spend");
  const max = Math.max(...ACTIVITY_DAYS.map((d) => d[metric]));
  const total = ACTIVITY_DAYS.reduce((s, d) => s + d[metric], 0);

  const fmt = (v: number) =>
    metric === "spend" ? fmtMoney(v) : metric === "tokens" ? `${v.toFixed(1)}M` : v.toLocaleString();

  return (
    <>
      <h1 className="font-display" style={{ fontSize: 34, margin: "0 0 6px" }}>Activity</h1>
      <p style={{ color: "var(--muted-foreground)", margin: "0 0 24px" }}>Last 30 days across all keys.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 24 }}>
        {(
          [
            ["spend", "Spend", fmtMoney(ACTIVITY_DAYS.reduce((s, d) => s + d.spend, 0))],
            ["requests", "Requests", ACTIVITY_DAYS.reduce((s, d) => s + d.requests, 0).toLocaleString()],
            ["tokens", "Tokens", `${ACTIVITY_DAYS.reduce((s, d) => s + d.tokens, 0).toFixed(0)}M`],
          ] as [Metric, string, string][]
        ).map(([m, label, value]) => (
          <button
            key={m}
            onClick={() => setMetric(m)}
            className="card"
            style={{
              padding: 18,
              textAlign: "left",
              cursor: "pointer",
              borderColor: metric === m ? "var(--primary)" : "var(--border-subtle)",
            }}
          >
            <div className="label" style={{ marginBottom: 6 }}>{label} · 30d</div>
            <div className="font-mono" style={{ fontSize: 24, fontWeight: 600 }}>{value}</div>
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 24 }}>
        <div className="label" style={{ marginBottom: 18 }}>
          Daily {metric} — total {fmt(total)}
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 200 }}>
          {ACTIVITY_DAYS.map((d, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }} title={`${d.date}: ${fmt(d[metric])}`}>
              <div
                style={{
                  width: "100%",
                  height: `${(d[metric] / max) * 180}px`,
                  background: i >= ACTIVITY_DAYS.length - 7 ? "var(--primary)" : "var(--surface-2)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "4px 4px 0 0",
                  transition: "height 0.3s",
                }}
              />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <span className="font-mono" style={{ fontSize: 10, color: "var(--muted-foreground)" }}>{ACTIVITY_DAYS[0].date}</span>
          <span className="font-mono" style={{ fontSize: 10, color: "var(--muted-foreground)" }}>today</span>
        </div>
      </div>
    </>
  );
}
