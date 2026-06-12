"use client";

import { useEffect, useState } from "react";
import { Copy, Plus, Trash2, Power } from "lucide-react";
import { SEED_KEYS, type ApiKey, fmtMoney } from "@/lib/data";

type LiveKey = {
  id: string;
  name: string;
  prefix: string;
  suffix: string;
  created: string;
  last_used: string;
  limit_usd: number | null;
  spend_mtd_usd: number;
  disabled: boolean;
};

function liveToView(k: LiveKey): ApiKey {
  return {
    id: k.id,
    name: k.name,
    key: `${k.prefix}…${k.suffix}`,
    created: k.created,
    lastUsed: k.last_used,
    limit: k.limit_usd,
    spendMtd: k.spend_mtd_usd,
    disabled: k.disabled,
  };
}

export default function KeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>(SEED_KEYS);
  const [live, setLive] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [limit, setLimit] = useState("");
  const [newKey, setNewKey] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    try {
      const res = await fetch("/api/v1/keys");
      if (res.ok) {
        const json = (await res.json()) as { data: LiveKey[] };
        setKeys((json.data ?? []).map(liveToView));
        setLive(true);
      }
    } catch {
      // soft-fail — keep seed
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const create = async () => {
    if (!name.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          limit_usd: limit ? Number(limit) : null,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error ?? `HTTP ${res.status}`);
        return;
      }
      const j = (await res.json()) as { key: string; record: LiveKey };
      setNewKey(j.key);
      setName("");
      setLimit("");
      setCreating(false);
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const toggle = async (k: ApiKey) => {
    if (!live) {
      setKeys(keys.map((x) => (x.id === k.id ? { ...x, disabled: !x.disabled } : x)));
      return;
    }
    const res = await fetch(`/api/v1/keys/${encodeURIComponent(k.id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ disabled: !k.disabled }),
    });
    if (res.ok) await refresh();
  };

  const remove = async (k: ApiKey) => {
    if (!live) {
      setKeys(keys.filter((x) => x.id !== k.id));
      return;
    }
    const res = await fetch(`/api/v1/keys/${encodeURIComponent(k.id)}`, { method: "DELETE" });
    if (res.ok) await refresh();
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
        Workspace <span className="font-mono" style={{ fontSize: 12 }}>default</span>.{" "}
        {live
          ? "Keys stored in MongoDB; full key shown once on creation."
          : "Showing seed data — Mongo unreachable."}
      </p>

      {error && (
        <div className="card" style={{ padding: 14, marginBottom: 16, borderColor: "var(--destructive)" }}>
          <div className="font-mono" style={{ fontSize: 12, color: "var(--destructive)" }}>{error}</div>
        </div>
      )}

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
            <button className="btn-primary" onClick={create} disabled={busy}>{busy ? "Creating…" : "Create"}</button>
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
                onClick={() => toggle(k)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}
              >
                <Power size={14} />
              </button>
              <button
                title="Delete"
                onClick={() => remove(k)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--destructive)" }}
              >
                <Trash2 size={14} />
              </button>
            </span>
          </div>
        ))}
        {keys.length === 0 && (
          <div style={{ padding: 32, textAlign: "center", color: "var(--muted-foreground)", fontSize: 13 }}>
            No keys yet. Click <strong>Create key</strong> to make one.
          </div>
        )}
      </div>
    </>
  );
}
