import { APPS } from "@/lib/data";

export default function AppsPage() {
  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px 96px" }}>
      <h1 className="font-display" style={{ fontSize: 40, margin: "0 0 6px" }}>
        Top Apps
      </h1>
      <p style={{ color: "var(--muted-foreground)", margin: "0 0 28px" }}>
        Products building on the platform, ranked by weekly token usage. Illustrative data.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {APPS.map((a, i) => (
          <div key={a.name} className="card" style={{ padding: 20, display: "flex", gap: 14 }}>
            <span
              className="font-mono"
              style={{ fontSize: 12, color: "var(--muted-foreground)", paddingTop: 3 }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <h3 style={{ margin: 0, fontSize: 15 }}>{a.name}</h3>
                <span className="font-mono" style={{ fontSize: 11, color: "var(--secondary-foreground)" }}>
                  {a.tokensWk}B/wk
                </span>
              </div>
              <span className="label" style={{ fontSize: 10 }}>{a.category}</span>
              <p style={{ margin: "8px 0 0", fontSize: 13, color: "var(--muted-foreground)" }}>{a.description}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
