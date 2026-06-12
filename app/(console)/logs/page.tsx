"use client";

import { useMemo, useState } from "react";
import { LOGS, fmtMoney } from "@/lib/data";

export default function LogsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");

  const rows = useMemo(
    () =>
      LOGS.filter(
        (l) =>
          (status === "All" || (status === "Errors" ? l.status === "error" : l.status === "200")) &&
          (l.model.includes(q.toLowerCase()) || l.id.includes(q.toLowerCase()) || l.app.includes(q.toLowerCase()))
      ),
    [q, status]
  );

  return (
    <>
      <h1 className="font-display" style={{ fontSize: 34, margin: "0 0 6px" }}>Logs</h1>
      <p style={{ color: "var(--muted-foreground)", margin: "0 0 24px" }}>
        Per-request detail for the current day. Retention follows your privacy settings.
      </p>

      <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
        <input
          className="input"
          style={{ maxWidth: 320 }}
          placeholder="Filter by model, key, or request id…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className="input" style={{ width: 130 }} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>All</option>
          <option>Success</option>
          <option>Errors</option>
        </select>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <div
          className="label"
          style={{
            display: "grid",
            gridTemplateColumns: "110px 1fr 110px 90px 90px 80px 80px 60px",
            gap: 10,
            padding: "12px 18px",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <span>Time</span><span>Model</span><span>Key</span>
          <span style={{ textAlign: "right" }}>Tok in</span>
          <span style={{ textAlign: "right" }}>Tok out</span>
          <span style={{ textAlign: "right" }}>Cost</span>
          <span style={{ textAlign: "right" }}>Latency</span>
          <span style={{ textAlign: "right" }}>Status</span>
        </div>
        {rows.map((l) => (
          <div
            key={l.id}
            className="table-row font-mono"
            style={{
              display: "grid",
              gridTemplateColumns: "110px 1fr 110px 90px 90px 80px 80px 60px",
              gap: 10,
              padding: "10px 18px",
              fontSize: 11.5,
              alignItems: "center",
            }}
          >
            <span style={{ color: "var(--muted-foreground)" }}>{l.time.slice(11)}</span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.model}</span>
            <span style={{ color: "var(--muted-foreground)" }}>{l.app}</span>
            <span style={{ textAlign: "right" }}>{l.tokensIn.toLocaleString()}</span>
            <span style={{ textAlign: "right" }}>{l.tokensOut.toLocaleString()}</span>
            <span style={{ textAlign: "right" }}>{fmtMoney(l.cost, 4)}</span>
            <span style={{ textAlign: "right", color: "var(--muted-foreground)" }}>{l.latency.toFixed(1)}s</span>
            <span
              style={{
                textAlign: "right",
                color: l.status === "error" ? "var(--destructive)" : "var(--success)",
                fontWeight: 600,
              }}
            >
              {l.status === "error" ? "ERR" : "200"}
            </span>
          </div>
        ))}
        {rows.length === 0 && (
          <div style={{ padding: 32, textAlign: "center", color: "var(--muted-foreground)", fontSize: 13 }}>
            No requests match that filter.
          </div>
        )}
      </div>
    </>
  );
}
