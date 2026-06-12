import Link from "next/link";
import { ArrowRight, Zap, Shield, BarChart3 } from "lucide-react";
import { MODELS, RANKINGS, fmtTokens } from "@/lib/data";

export default function Home() {
  const top = RANKINGS.slice(0, 5);
  return (
    <main style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px" }}>
      <section style={{ padding: "96px 0 72px", maxWidth: 760 }}>
        <p className="label" style={{ marginBottom: 16 }}>
          One API · {MODELS.length}+ models · Zero lock-in
        </p>
        <h1 className="font-display" style={{ fontSize: 64, lineHeight: 1.05, margin: 0 }}>
          The unified interface for <em style={{ color: "var(--primary)" }}>every model</em>.
        </h1>
        <p style={{ fontSize: 17, color: "var(--muted-foreground)", margin: "24px 0 32px", maxWidth: 560 }}>
          Route requests across frontier and open-weight models through a single endpoint.
          Automatic failover, transparent pricing, and usage analytics built in.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/docs/quickstart" className="btn-primary" style={{ padding: "11px 22px", fontSize: 14 }}>
            Get started <ArrowRight size={15} />
          </Link>
          <Link href="/models" className="btn-secondary" style={{ padding: "10px 21px", fontSize: 14 }}>
            Browse models
          </Link>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, paddingBottom: 72 }}>
        {[
          { icon: <Zap size={18} />, t: "One endpoint", d: "Swap models by changing a string. OpenAI-compatible API surface." },
          { icon: <Shield size={18} />, t: "Automatic failover", d: "Provider outages reroute silently. Your app stays up." },
          { icon: <BarChart3 size={18} />, t: "Spend visibility", d: "Per-key limits, per-request logs, daily activity rollups." },
        ].map((f) => (
          <div key={f.t} className="card" style={{ padding: 24 }}>
            <span style={{ color: "var(--primary)" }}>{f.icon}</span>
            <h3 style={{ fontSize: 15, margin: "12px 0 6px" }}>{f.t}</h3>
            <p style={{ fontSize: 13, color: "var(--muted-foreground)", margin: 0 }}>{f.d}</p>
          </div>
        ))}
      </section>

      <section style={{ paddingBottom: 96 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
          <h2 className="font-display" style={{ fontSize: 28, margin: 0 }}>
            Trending this week
          </h2>
          <Link href="/rankings" style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600 }}>
            Full rankings →
          </Link>
        </div>
        <div className="card" style={{ overflow: "hidden" }}>
          {top.map((m) => (
            <Link
              key={m.slug}
              href="/models"
              className="table-row"
              style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 20px" }}
            >
              <span className="font-mono" style={{ width: 24, color: "var(--muted-foreground)", fontSize: 12 }}>
                {String(m.rank).padStart(2, "0")}
              </span>
              <span style={{ fontWeight: 600, flex: 1 }}>{m.name}</span>
              <span style={{ fontSize: 12, color: "var(--muted-foreground)", width: 110 }}>{m.provider}</span>
              <span className="font-mono" style={{ fontSize: 12, color: "var(--secondary-foreground)" }}>
                {fmtTokens(m.tokensWk)} tok/wk
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
