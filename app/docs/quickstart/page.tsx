const CURL = `curl https://openrouterai.vercel.app/api/v1/chat/completions \\
  -H "Authorization: Bearer $OPENROUTERAI_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "anthropic/claude-sonnet-4.5",
    "messages": [
      { "role": "user", "content": "What is the meaning of life?" }
    ]
  }'`;

const TS = `import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://openrouterai.vercel.app/api/v1",
  apiKey: process.env.OPENROUTERAI_API_KEY,
});

const completion = await client.chat.completions.create({
  model: "anthropic/claude-sonnet-4.5",
  messages: [{ role: "user", content: "Hello!" }],
});

console.log(completion.choices[0].message.content);`;

const PY = `from openai import OpenAI

client = OpenAI(
    base_url="https://openrouterai.vercel.app/api/v1",
    api_key=os.environ["OPENROUTERAI_API_KEY"],
)

completion = client.chat.completions.create(
    model="anthropic/claude-sonnet-4.5",
    messages=[{"role": "user", "content": "Hello!"}],
)

print(completion.choices[0].message.content)`;

function Code({ title, code }: { title: string; code: string }) {
  return (
    <div className="card" style={{ overflow: "hidden", marginBottom: 24 }}>
      <div
        className="label"
        style={{ padding: "10px 16px", borderBottom: "1px solid var(--border-subtle)" }}
      >
        {title}
      </div>
      <pre
        className="font-mono"
        style={{
          margin: 0,
          padding: 18,
          fontSize: 12.5,
          lineHeight: 1.6,
          overflowX: "auto",
          color: "var(--secondary-foreground)",
        }}
      >
        {code}
      </pre>
    </div>
  );
}

export default function QuickstartPage() {
  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "48px 24px 96px" }}>
      <p className="label" style={{ marginBottom: 12 }}>Docs / Quickstart</p>
      <h1 className="font-display" style={{ fontSize: 40, margin: "0 0 12px" }}>
        Quickstart
      </h1>
      <p style={{ color: "var(--muted-foreground)", margin: "0 0 32px" }}>
        Make your first request in under a minute. The API is OpenAI-compatible, so existing
        SDKs work by pointing them at a new base URL.
      </p>

      <div
        className="card"
        style={{
          padding: 16,
          marginBottom: 28,
          background: "var(--accent)",
          borderColor: "var(--primary)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: "var(--accent-foreground)",
            fontWeight: 500,
          }}
        >
          These examples work right now — the proxy routes to OpenRouter using
          our server-side <span className="font-mono">OPENROUTER_API_KEY</span>.
        </p>
      </div>

      <h2 style={{ fontSize: 18, margin: "0 0 8px" }}>1 · Create an API key</h2>
      <p style={{ fontSize: 14, color: "var(--muted-foreground)", margin: "0 0 20px" }}>
        Sign in, open <span className="font-mono" style={{ fontSize: 12 }}>Workspaces → Keys</span>, and create a key.
        Set an optional spend limit per key.
      </p>

      <h2 style={{ fontSize: 18, margin: "0 0 8px" }}>2 · Call the API</h2>
      <Code title="curl" code={CURL} />
      <Code title="TypeScript · openai sdk" code={TS} />
      <Code title="Python · openai sdk" code={PY} />

      <h2 style={{ fontSize: 18, margin: "0 0 8px" }}>3 · Switch models freely</h2>
      <p style={{ fontSize: 14, color: "var(--muted-foreground)" }}>
        Change the <span className="font-mono" style={{ fontSize: 12 }}>model</span> string to any slug from the
        catalog — for example{" "}
        <span className="font-mono" style={{ fontSize: 12 }}>openai/gpt-5.2</span> or{" "}
        <span className="font-mono" style={{ fontSize: 12 }}>deepseek/deepseek-v4</span>. Everything else stays the
        same. Append <span className="font-mono" style={{ fontSize: 12 }}>:floor</span> to route to the cheapest
        provider, or <span className="font-mono" style={{ fontSize: 12 }}>:nitro</span> for the fastest.
      </p>
    </main>
  );
}
