import Link from "next/link";
import { MODELS, fmtCtx } from "@/lib/data";

export default function PricingPage() {
  const sample = MODELS.slice().sort((a, b) => a.inputPrice - b.inputPrice);
  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px 96px" }}>
      <h1 className="font-display" style={{ fontSize: 40, margin: "0 0 6px" }}>
        Pricing
      </h1>
      <p style={{ color: "var(--muted-foreground)", margin: "0 0 32px", maxWidth: 600 }}>
        Pay only for the tokens you use, at each provider&apos;s listed rate. No subscriptions,
        no markup on inference, no minimums.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 48 }}>
        {[
          { t: "Pass-through rates", d: "Model prices match what providers charge. You see the per-million-token rate before every request." },
          { t: "5% + $0.35 on top-ups", d: "Our only fee is applied when you purchase credits — never on inference itself." },
          { t: "Credits never expire", d: "Buy once, draw down across any model, any key, any workspace." },
        ].map((x) => (
          <div key={x.t} className="card" style={{ padding: 22 }}>
            <h3 style={{ fontSize: 15, margin: "0 0 8px", color: "var(--primary)" }}>{x.t}</h3>
            <p style={{ fontSize: 13, color: "var(--muted-foreground)", margin: 0 }}>{x.d}</p>
          </div>
        ))}
      </div>

      <h2 className="font-display" style={{ fontSize: 26, margin: "0 0 16px" }}>
        Current model rates
      </h2>
      <div className="card" style={{ overflow: "hidden", marginBottom: 32 }}>
        <div
          className="label"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 120px 110px 110px 90px",
            gap: 12,
            padding: "12px 20px",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <span>Model</span>
          <span>Provider</span>
          <span style={{ textAlign: "right" }}>Input /M</span>
          <span style={{ textAlign: "right" }}>Output /M</span>
          <span style={{ textAlign: "right" }}>Context</span>
        </div>
        {sample.map((m) => (
          <div
            key={m.slug}
            className="table-row"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 120px 110px 110px 90px",
              gap: 12,
              padding: "12px 20px",
              fontSize: 13,
              alignItems: "center",
            }}
          >
            <span style={{ fontWeight: 600 }}>{m.name}</span>
            <span style={{ color: "var(--muted-foreground)" }}>{m.provider}</span>
            <span className="font-mono" style={{ textAlign: "right", fontSize: 12 }}>${m.inputPrice.toFixed(2)}</span>
            <span className="font-mono" style={{ textAlign: "right", fontSize: 12 }}>${m.outputPrice.toFixed(2)}</span>
            <span className="font-mono" style={{ textAlign: "right", fontSize: 12, color: "var(--muted-foreground)" }}>
              {fmtCtx(m.context)}
            </span>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h3 style={{ margin: "0 0 4px", fontSize: 16 }}>Ready to start?</h3>
          <p style={{ margin: 0, fontSize: 13, color: "var(--muted-foreground)" }}>
            $1 of free credit on every new account.
          </p>
        </div>
        <Link href="/settings/credits" className="btn-primary">
          Add credits
        </Link>
      </div>
    </main>
  );
}
