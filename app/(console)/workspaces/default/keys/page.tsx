"use client";

import { useState } from "react";
import { Copy, Plus, Trash2, Power } from "lucide-react";
import { SEED_KEYS, ApiKey, fmtMoney } from "@/lib/data";

export default function KeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>(SEED_KEYS);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [limit, setLimit] = useState("");
  const [newKey, setNewKey] = useState<string | null>(null);

  const create = () => {
    if (!name.trim()) return;
    const raw = `sk-or-v1-${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}`;
    setKeys([
      {
        id: `k${Date.now()}`,
        name: name.trim(),
        key: `${raw.slice(0, 13)}…${raw.slice(-4)}`,
        created: "2026-06-12",
        lastUsed: "—",
        limit: limit ? Number(limit) : null,
        spendMtd: 0,
        disabled: false,
      },
      ...keys,
    ]);
    setNewKey(raw);
    setName("");
    setLimit("");
    setCreating(false);
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <h1 className="font-display" style={{ fontSize: 34, margin: 0 }}>API Keys</h1>
        <button className="btn-primary" onClick={() => setCreating(true)}>
          <Plus size={14} /> Create key
        </button>
      </div>
      <p style={{ color: "var(--muted-foreground)", margin: "0 0 24px" }}>
        Workspace <span className="font-mono" style={{ fontSize: 12 }}>default</span>. Keys inherit the workspace
        provider policy; per-key limits cap monthly spend.
      </p>

      {newKey && (
        <div className="card" style={{ padding: 18, marginBottom: 20, borderColor: "var(--primary)" }}>
          <div className="label" style={{ marginBottom: 8, color: "var(--primary)" }}>
            Key created — copy it now, it won&apos;t be shown again
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <code className="font-mono" style={{ fontSize: 12, background: "var(--surface-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
              {newKey}
            </code>
            <button className="btn-secondary" onClick={() => navigator.clipboard?.writeText(newKey)}>
              <Copy size={13} /> Copy
            </button>
            <button className="btn-secondary" onClick={() => setNewKey(null)}>Done</button>
          </div>
        </div>
      )}

      {creating && (
        <div className="card" style={{ padding: 20, marginBottom: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 180px auto auto", gap: 12, alignItems: "end" }}>
            <div>
              <div className="label" style={{ marginBottom: 6 }}>Name</div>
              <input className="input" placeholder="e.g. production" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <div className="label" style={{ marginBottom: 6 }}>Monthly limit ($)</div>
              <input className="input" placeholder="none" value={limit} onChange={(e) => setLimit(e.target.value.replace(/[^0-9.]/g, ""))} />
            </div>
            <button className="btn-primary" onClick={create}>Create</button>
            <button className="btn-secondary" onClick={() => setCreating(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="card" style={{ overflow: "hidden" }}>
        <div
          className="label"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 190px 100px 100px 110px 90px",
            gap: 12,
            padding: "12px 18px",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <span>Name</span><span>Key</span><span>Created</span><span>Last used</span>
          <span style={{ textAlign: "right" }}>Spend / limit</span><span style={{ textAlign: "right" }}>Actions</span>
        </div>
        {keys.map((k) => (
          <div
            key={k.id}
            className="table-row"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 190px 100px 100px 110px 90px",
              gap: 12,
              padding: "13px 18px",
              fontSize: 13,
              alignItems: "center",
              opacity: k.disabled ? 0.45 : 1,
            }}
          >
            <span style={{ fontWeight: 600 }}>{k.name}</span>
            <code className="font-mono" style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{k.key}</code>
            <span style={{ color: "var(--muted-foreground)", fontSize: 12 }}>{k.created}</span>
            <span style={{ color: "var(--muted-foreground)", fontSize: 12 }}>{k.lastUsed}</span>
            <span className="font-mono" style={{ textAlign: "right", fontSize: 12 }}>
              {fmtMoney(k.spendMtd)} / {k.limit ? fmtMoney(k.limit, 0) : "∞"}
            </span>
            <span style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
              <button
                title={k.disabled ? "Enable" : "Disable"}
                onClick={() => setKeys(keys.map((x) => (x.id === k.id ? { ...x, disabled: !x.disabled } : x)))}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}
              >
                <Power size={14} />
              </button>
              <button
                title="Delete"
                onClick={() => setKeys(keys.filter((x) => x.id !== k.id))}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--destructive)" }}
              >
                <Trash2 size={14} />
              </button>
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
