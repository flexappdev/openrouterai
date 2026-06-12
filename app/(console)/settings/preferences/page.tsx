"use client";

import { useState } from "react";
import { MODELS } from "@/lib/data";

export default function PreferencesPage() {
  const [defaultModel, setDefaultModel] = useState("anthropic/claude-sonnet-4.5");
  const [routing, setRouting] = useState<"balanced" | "floor" | "nitro">("balanced");
  const [fallbacks, setFallbacks] = useState(true);

  return (
    <>
      <h1 className="font-display" style={{ fontSize: 34, margin: "0 0 6px" }}>Preferences</h1>
      <p style={{ color: "var(--muted-foreground)", margin: "0 0 24px" }}>
        Defaults applied when a request doesn&apos;t specify them explicitly.
      </p>

      <div className="card" style={{ maxWidth: 680, padding: 24, display: "grid", gap: 22 }}>
        <div>
          <div className="label" style={{ marginBottom: 6 }}>Default model</div>
          <select className="input" style={{ maxWidth: 340 }} value={defaultModel} onChange={(e) => setDefaultModel(e.target.value)}>
            {MODELS.map((m) => (
              <option key={m.slug} value={m.slug}>{m.slug}</option>
            ))}
          </select>
        </div>

        <div>
          <div className="label" style={{ marginBottom: 8 }}>Routing strategy</div>
          <div style={{ display: "flex", gap: 8 }}>
            {(
              [
                ["balanced", "Balanced", "Best mix of price and latency"],
                ["floor", "Floor", "Always cheapest provider"],
                ["nitro", "Nitro", "Always fastest provider"],
              ] as const
            ).map(([v, label, desc]) => (
              <button
                key={v}
                onClick={() => setRouting(v)}
                className="card"
                style={{
                  flex: 1, padding: 14, textAlign: "left", cursor: "pointer",
                  borderColor: routing === v ? "var(--primary)" : "var(--border-subtle)",
                  background: routing === v ? "var(--accent)" : "var(--card)",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 13 }}>{label}</div>
                <div style={{ fontSize: 11.5, color: "var(--muted-foreground)", marginTop: 2 }}>{desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Provider fallbacks</div>
            <div style={{ fontSize: 12.5, color: "var(--muted-foreground)" }}>
              Retry on alternative providers when the primary errors or rate-limits.
            </div>
          </div>
          <button
            onClick={() => setFallbacks(!fallbacks)}
            style={{
              width: 42, height: 24, borderRadius: 999, border: "none", cursor: "pointer",
              background: fallbacks ? "var(--primary)" : "var(--surface-2)", position: "relative",
            }}
            aria-pressed={fallbacks}
          >
            <span style={{ position: "absolute", top: 3, left: fallbacks ? 21 : 3, width: 18, height: 18, borderRadius: 999, background: "#fff", transition: "left 0.15s" }} />
          </button>
        </div>

        <div>
          <button className="btn-primary">Save preferences</button>
        </div>
      </div>
    </>
  );
}
