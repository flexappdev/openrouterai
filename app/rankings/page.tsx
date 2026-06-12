"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { RANKINGS, fmtTokens } from "@/lib/data";

const TABS = ["All categories", "Programming", "Roleplay", "Marketing", "Translation"];

export default function RankingsPage() {
  const [tab, setTab] = useState(TABS[0]);
  const max = RANKINGS[0].tokensWk;

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px 96px" }}>
      <h1 className="font-display" style={{ fontSize: 40, margin: "0 0 6px" }}>
        Rankings
      </h1>
      <p style={{ color: "var(--muted-foreground)", margin: "0 0 28px" }}>
        Token throughput across the platform over the past week. Illustrative data.
      </p>

      <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={t === tab ? "btn-primary" : "btn-secondary"}
            style={{ fontSize: 12 }}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <div
          className="label"
          style={{
            display: "grid",
            gridTemplateColumns: "44px 1fr 130px 120px 70px",
            gap: 12,
            padding: "12px 20px",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <span>#</span>
          <span>Model</span>
          <span>Provider</span>
          <span style={{ textAlign: "right" }}>Tokens / wk</span>
          <span style={{ textAlign: "right" }}>Δ</span>
        </div>
        {RANKINGS.map((m) => (
          <div
            key={m.slug}
            className="table-row"
            style={{
              display: "grid",
              gridTemplateColumns: "44px 1fr 130px 120px 70px",
              gap: 12,
              padding: "13px 20px",
              alignItems: "center",
            }}
          >
            <span className="font-mono" style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
              {String(m.rank).padStart(2, "0")}
            </span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{m.name}</div>
              <div
                style={{
                  height: 3,
                  marginTop: 6,
                  borderRadius: 2,
                  background: "var(--surface-2)",
                  maxWidth: 320,
                }}
              >
                <div
                  style={{
                    height: 3,
                    borderRadius: 2,
                    width: `${(m.tokensWk / max) * 100}%`,
                    background: m.rank <= 3 ? "var(--primary)" : "var(--muted-foreground)",
                  }}
                />
              </div>
            </div>
            <span style={{ fontSize: 13, color: "var(--muted-foreground)" }}>{m.provider}</span>
            <span className="font-mono" style={{ fontSize: 12, textAlign: "right" }}>
              {fmtTokens(m.tokensWk)}
            </span>
            <span
              style={{
                textAlign: "right",
                fontSize: 12,
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 4,
                color: m.trend > 0 ? "var(--success)" : m.trend < 0 ? "var(--destructive)" : "var(--muted-foreground)",
              }}
            >
              {m.trend > 0 ? <TrendingUp size={13} /> : m.trend < 0 ? <TrendingDown size={13} /> : <Minus size={13} />}
              {Math.abs(m.trend) || ""}
            </span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 14 }}>
        Category: {tab}. Rankings refresh daily at 00:00 UTC.
      </p>
    </main>
  );
}
