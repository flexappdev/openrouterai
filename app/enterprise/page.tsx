import Link from "next/link";
import { Shield, Lock, Gauge, Headset, FileCheck, Network } from "lucide-react";

const FEATURES = [
  { icon: <Shield size={18} />, t: "SSO & SCIM", d: "SAML single sign-on with automated user provisioning across your org." },
  { icon: <Lock size={18} />, t: "Zero data retention", d: "Route to providers under ZDR agreements; prompts are never stored." },
  { icon: <Gauge size={18} />, t: "Dedicated throughput", d: "Reserved capacity and rate limits sized to your production traffic." },
  { icon: <FileCheck size={18} />, t: "Compliance", d: "SOC 2 Type II reports, DPAs, and regional data routing controls." },
  { icon: <Network size={18} />, t: "Private routing", d: "Pin requests to specific providers, regions, or self-hosted endpoints." },
  { icon: <Headset size={18} />, t: "Priority support", d: "Named account team with engineering escalation and uptime SLAs." },
];

export default function EnterprisePage() {
  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "64px 24px 96px" }}>
      <p className="label" style={{ marginBottom: 14 }}>Enterprise</p>
      <h1 className="font-display" style={{ fontSize: 48, margin: "0 0 16px", maxWidth: 640 }}>
        Model infrastructure your security team will sign off on.
      </h1>
      <p style={{ fontSize: 16, color: "var(--muted-foreground)", maxWidth: 560, margin: "0 0 32px" }}>
        Everything in the standard platform, plus the controls, contracts, and capacity guarantees
        that production AI at scale requires.
      </p>
      <div style={{ display: "flex", gap: 12, marginBottom: 64 }}>
        <Link href="#" className="btn-primary" style={{ padding: "11px 22px", fontSize: 14 }}>
          Talk to sales
        </Link>
        <Link href="/pricing" className="btn-secondary" style={{ padding: "10px 21px", fontSize: 14 }}>
          See pricing
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 16 }}>
        {FEATURES.map((f) => (
          <div key={f.t} className="card" style={{ padding: 22 }}>
            <span style={{ color: "var(--primary)" }}>{f.icon}</span>
            <h3 style={{ fontSize: 15, margin: "12px 0 6px" }}>{f.t}</h3>
            <p style={{ fontSize: 13, color: "var(--muted-foreground)", margin: 0 }}>{f.d}</p>
          </div>
        ))}
      </div>

      <div
        className="card"
        style={{
          marginTop: 48,
          padding: 32,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h3 className="font-display" style={{ fontSize: 24, margin: "0 0 4px" }}>
            Running more than 1B tokens a day?
          </h3>
          <p style={{ margin: 0, fontSize: 13, color: "var(--muted-foreground)" }}>
            Volume pricing and dedicated capacity start here.
          </p>
        </div>
        <Link href="#" className="btn-primary">
          Book a call
        </Link>
      </div>
    </main>
  );
}
