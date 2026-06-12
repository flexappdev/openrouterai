"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { MODELS, fmtCtx, fmtTokens } from "@/lib/data";

const PROVIDERS = ["All", ...Array.from(new Set(MODELS.map((m) => m.provider)))];

export default function ModelsPage() {
  const [q, setQ] = useState("");
  const [provider, setProvider] = useState("All");
  const [sort, setSort] = useState<"tokens" | "newest" | "cheapest">("tokens");

  const list = useMemo(() => {
    let r = MODELS.filter(
      (m) =>
        (provider === "All" || m.provider === provider) &&
        (m.name.toLowerCase().includes(q.toLowerCase()) || m.slug.includes(q.toLowerCase()))
    );
    if (sort === "tokens") r = r.slice().sort((a, b) => b.tokensWk - a.tokensWk);
    if (sort === "newest") r = r.slice().sort((a, b) => b.added.localeCompare(a.added));
    if (sort === "cheapest") r = r.slice().sort((a, b) => a.inputPrice - b.inputPrice);
    return r;
  }, [q, provider, sort]);

  return (
    <main style={{ maxWidth: 1240, margin: "0 auto", padding: "48px 24px 96px" }}>
      <h1 className="font-display" style={{ fontSize: 40, margin: "0 0 6px" }}>
        Models
      </h1>
      <p style={{ color: "var(--muted-foreground)", margin: "0 0 28px" }}>
        {MODELS.length} models from {PROVIDERS.length - 1} providers, one API.
      </p>

      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 260 }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: 11, color: "var(--muted-foreground)" }} />
          <input
            className="input"
            style={{ paddingLeft: 36 }}
            placeholder="Filter models…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select className="input" style={{ width: 170 }} value={provider} onChange={(e) => setProvider(e.target.value)}>
          {PROVIDERS.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <select className="input" style={{ width: 170 }} value={sort} onChange={(e) => setSort(e.target.value as never)}>
          <option value="tokens">Top weekly</option>
          <option value="newest">Newest</option>
          <option value="cheapest">Lowest price</option>
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 16 }}>
        {list.map((m) => (
          <div key={m.slug} className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16 }}>{m.name}</h3>
                <span className="font-mono" style={{ fontSize: 11, color: "var(--muted-foreground)" }}>
                  {m.slug}
                </span>
              </div>
              {m.modality === "multimodal" && (
                <span
                  style={{
                    background: "var(--info-muted)",
                    color: "var(--info)",
                    fontSize: 10,
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: 999,
                  }}
                >
                  multimodal
                </span>
              )}
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "var(--muted-foreground)", flex: 1 }}>{m.description}</p>
            <div
              className="font-mono"
              style={{
                display: "flex",
                gap: 14,
                fontSize: 11,
                color: "var(--secondary-foreground)",
                borderTop: "1px solid var(--border-subtle)",
                paddingTop: 12,
              }}
            >
              <span>{fmtCtx(m.context)} ctx</span>
              <span>${m.inputPrice}/M in</span>
              <span>${m.outputPrice}/M out</span>
              <span style={{ marginLeft: "auto", color: "var(--muted-foreground)" }}>{fmtTokens(m.tokensWk)}/wk</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
