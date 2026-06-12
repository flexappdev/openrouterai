"use client";

import { useState } from "react";
import { CREDIT_HISTORY, fmtMoney } from "@/lib/data";

export default function CreditsPage() {
  const [amount, setAmount] = useState("100");
  const [autoTopUp, setAutoTopUp] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fee = amount ? Number(amount) * 0.05 + 0.35 : 0;

  const purchase = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount_usd: Number(amount) }),
      });
      if (res.ok) {
        const { url } = (await res.json()) as { url: string };
        window.location.assign(url);
        return;
      }
      const j = (await res.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
      };
      if (j.error === "stripe_unconfigured") {
        setError(
          "Stripe is not configured yet. Add STRIPE_SECRET_KEY in Vercel to enable purchases."
        );
      } else {
        setError(j.message ?? j.error ?? `HTTP ${res.status}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <h1 className="font-display" style={{ fontSize: 34, margin: "0 0 24px" }}>Credits</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24, maxWidth: 760 }}>
        <div className="card" style={{ padding: 24 }}>
          <div className="label" style={{ marginBottom: 8 }}>Current balance</div>
          <div className="font-mono" style={{ fontSize: 34, fontWeight: 600, color: "var(--primary)" }}>$161.71</div>
          <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "8px 0 0" }}>
            ≈ 23 days at your current burn rate.
          </p>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <div className="label" style={{ marginBottom: 10 }}>Buy credits</div>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              className="input"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
              style={{ width: 110 }}
            />
            <button className="btn-primary" onClick={purchase} disabled={busy}>
              {busy ? "Redirecting…" : "Purchase"}
            </button>
          </div>
          <p className="font-mono" style={{ fontSize: 11, color: "var(--muted-foreground)", margin: "10px 0 0" }}>
            Fee: {fmtMoney(fee)} (5% + $0.35) · Total {fmtMoney(Number(amount || 0) + fee)}
          </p>
          {error && (
            <p style={{ fontSize: 12, color: "var(--destructive)", margin: "10px 0 0" }}>
              {error}
            </p>
          )}
        </div>
      </div>

      <div className="card" style={{ padding: 20, maxWidth: 760, marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Auto top-up</div>
          <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
            Add $50 whenever the balance drops below $10.
          </div>
        </div>
        <button
          onClick={() => setAutoTopUp(!autoTopUp)}
          style={{
            width: 42, height: 24, borderRadius: 999, border: "none", cursor: "pointer",
            background: autoTopUp ? "var(--primary)" : "var(--surface-2)",
            position: "relative", transition: "background 0.15s",
          }}
          aria-label="Toggle auto top-up"
        >
          <span
            style={{
              position: "absolute", top: 3, left: autoTopUp ? 21 : 3,
              width: 18, height: 18, borderRadius: 999, background: "#fff",
              transition: "left 0.15s",
            }}
          />
        </button>
      </div>

      <h2 style={{ fontSize: 16, margin: "0 0 12px" }}>History</h2>
      <div className="card" style={{ overflow: "hidden", maxWidth: 760 }}>
        {CREDIT_HISTORY.map((h, i) => (
          <div
            key={i}
            className="table-row"
            style={{ display: "grid", gridTemplateColumns: "120px 1fr 140px 90px", gap: 12, padding: "12px 18px", fontSize: 13, alignItems: "center" }}
          >
            <span className="font-mono" style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{h.date}</span>
            <span>{h.type}</span>
            <span style={{ color: "var(--muted-foreground)", fontSize: 12 }}>{h.method}</span>
            <span className="font-mono" style={{ textAlign: "right", color: "var(--success)" }}>+{fmtMoney(h.amount, 0)}</span>
          </div>
        ))}
      </div>
    </>
  );
}
