// Mock data layer for OpenRouterai. All figures are illustrative placeholders.

export type Model = {
  slug: string;
  name: string;
  provider: string;
  description: string;
  context: number; // tokens
  inputPrice: number; // $ per 1M tokens
  outputPrice: number; // $ per 1M tokens
  modality: "text" | "multimodal";
  series: string;
  tokensWk: number; // billions, mock weekly usage
  added: string;
};

export const MODELS: Model[] = [
  { slug: "anthropic/claude-opus-4.6", name: "Claude Opus 4.6", provider: "Anthropic", description: "Frontier reasoning and agentic coding model with strong long-horizon tool use.", context: 1000000, inputPrice: 5, outputPrice: 25, modality: "multimodal", series: "Claude", tokensWk: 412, added: "2026-02-05" },
  { slug: "anthropic/claude-sonnet-4.5", name: "Claude Sonnet 4.5", provider: "Anthropic", description: "Balanced flagship for production agents: fast, capable, cost-efficient.", context: 1000000, inputPrice: 3, outputPrice: 15, modality: "multimodal", series: "Claude", tokensWk: 688, added: "2025-09-29" },
  { slug: "anthropic/claude-haiku-4.5", name: "Claude Haiku 4.5", provider: "Anthropic", description: "Low-latency small model for routing, extraction, and high-volume tasks.", context: 200000, inputPrice: 1, outputPrice: 5, modality: "multimodal", series: "Claude", tokensWk: 530, added: "2025-10-01" },
  { slug: "openai/gpt-5.2", name: "GPT-5.2", provider: "OpenAI", description: "General-purpose frontier model with strong tool calling and broad ecosystem support.", context: 400000, inputPrice: 4, outputPrice: 16, modality: "multimodal", series: "GPT", tokensWk: 745, added: "2025-12-11" },
  { slug: "openai/gpt-5.2-mini", name: "GPT-5.2 Mini", provider: "OpenAI", description: "Compact variant tuned for cost-sensitive, high-throughput workloads.", context: 400000, inputPrice: 0.6, outputPrice: 2.4, modality: "multimodal", series: "GPT", tokensWk: 902, added: "2025-12-11" },
  { slug: "google/gemini-3-pro", name: "Gemini 3 Pro", provider: "Google", description: "Multimodal reasoning across text, image, audio, and video with very long context.", context: 2000000, inputPrice: 2.5, outputPrice: 12, modality: "multimodal", series: "Gemini", tokensWk: 633, added: "2025-11-18" },
  { slug: "google/gemini-3-flash", name: "Gemini 3 Flash", provider: "Google", description: "Speed-optimised multimodal model for interactive products.", context: 1000000, inputPrice: 0.3, outputPrice: 1.2, modality: "multimodal", series: "Gemini", tokensWk: 1104, added: "2025-11-18" },
  { slug: "x-ai/grok-4.1", name: "Grok 4.1", provider: "xAI", description: "Conversational frontier model with live-data grounding.", context: 256000, inputPrice: 3, outputPrice: 15, modality: "multimodal", series: "Grok", tokensWk: 287, added: "2025-11-02" },
  { slug: "deepseek/deepseek-v4", name: "DeepSeek V4", provider: "DeepSeek", description: "Open-weight MoE model with exceptional maths and code at low cost.", context: 128000, inputPrice: 0.27, outputPrice: 1.1, modality: "text", series: "DeepSeek", tokensWk: 821, added: "2025-12-26" },
  { slug: "deepseek/deepseek-r2", name: "DeepSeek R2", provider: "DeepSeek", description: "Open reasoning model with transparent chain-of-thought traces.", context: 128000, inputPrice: 0.55, outputPrice: 2.19, modality: "text", series: "DeepSeek", tokensWk: 463, added: "2026-01-14" },
  { slug: "meta-llama/llama-4-maverick", name: "Llama 4 Maverick", provider: "Meta", description: "Open-weight generalist with broad fine-tuning ecosystem.", context: 512000, inputPrice: 0.22, outputPrice: 0.88, modality: "multimodal", series: "Llama", tokensWk: 376, added: "2025-04-05" },
  { slug: "mistralai/mistral-large-3", name: "Mistral Large 3", provider: "Mistral AI", description: "European frontier model with strong multilingual coverage.", context: 256000, inputPrice: 2, outputPrice: 6, modality: "multimodal", series: "Mistral", tokensWk: 198, added: "2025-10-21" },
  { slug: "qwen/qwen-3.5-max", name: "Qwen 3.5 Max", provider: "Alibaba", description: "Large-scale open model leading several multilingual benchmarks.", context: 256000, inputPrice: 1.6, outputPrice: 6.4, modality: "multimodal", series: "Qwen", tokensWk: 354, added: "2026-01-28" },
  { slug: "moonshotai/kimi-k2.5", name: "Kimi K2.5", provider: "Moonshot AI", description: "Open agentic model with strong tool-orchestration performance.", context: 256000, inputPrice: 0.6, outputPrice: 2.5, modality: "text", series: "Kimi", tokensWk: 441, added: "2026-01-09" },
  { slug: "perplexity/sonar-pro-2", name: "Sonar Pro 2", provider: "Perplexity", description: "Search-grounded answers with citations built in.", context: 200000, inputPrice: 3, outputPrice: 15, modality: "text", series: "Sonar", tokensWk: 122, added: "2025-08-30" },
  { slug: "cohere/command-r2", name: "Command R2", provider: "Cohere", description: "Enterprise RAG specialist with grounded generation controls.", context: 256000, inputPrice: 2.5, outputPrice: 10, modality: "text", series: "Command", tokensWk: 87, added: "2025-09-12" },
];

export const RANKINGS = MODELS.slice()
  .sort((a, b) => b.tokensWk - a.tokensWk)
  .map((m, i) => ({ rank: i + 1, ...m, trend: [2, -1, 0, 3, 1, -2, 0, 1, -1, 2, 0, -3, 1, 0, 2, -1][i] ?? 0 }));

export const APPS = [
  { name: "Cline", category: "Coding agent", tokensWk: 91.2, description: "Autonomous coding agent living in your editor." },
  { name: "Forge Studio", category: "App builder", tokensWk: 64.8, description: "Prompt-to-product builder for full-stack web apps." },
  { name: "Scribe Notes", category: "Productivity", tokensWk: 41.3, description: "Meeting capture with structured action extraction." },
  { name: "PolyChat", category: "Chat client", tokensWk: 38.7, description: "Multi-model chat workspace for power users." },
  { name: "Lexa Legal", category: "Legal", tokensWk: 27.5, description: "Contract review and clause comparison at scale." },
  { name: "PipelinePilot", category: "Sales", tokensWk: 22.1, description: "CRM enrichment and outbound drafting agents." },
  { name: "QuantDesk", category: "Finance", tokensWk: 19.4, description: "Earnings-call analysis and research summarisation." },
  { name: "TutorLoop", category: "Education", tokensWk: 16.9, description: "Adaptive tutoring across maths and sciences." },
  { name: "RenderWrite", category: "Content", tokensWk: 14.2, description: "Long-form drafting with brand voice memory." },
  { name: "OpsSentry", category: "DevOps", tokensWk: 11.8, description: "Incident summarisation and runbook automation." },
  { name: "Healthscribe AI", category: "Healthcare", tokensWk: 9.6, description: "Clinical note structuring for HCP workflows." },
  { name: "Atlas Research", category: "Research", tokensWk: 8.3, description: "Deep literature review with citation graphs." },
];

export type ApiKey = {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  limit: number | null;
  spendMtd: number;
  disabled: boolean;
};

export const SEED_KEYS: ApiKey[] = [
  { id: "k1", name: "production", key: "sk-or-v1-9f3a…c21e", created: "2025-11-02", lastUsed: "2026-06-12", limit: 500, spendMtd: 212.4, disabled: false },
  { id: "k2", name: "staging", key: "sk-or-v1-77b1…08aa", created: "2026-01-15", lastUsed: "2026-06-11", limit: 50, spendMtd: 9.82, disabled: false },
  { id: "k3", name: "scroller-apps", key: "sk-or-v1-d40c…b7f3", created: "2026-03-08", lastUsed: "2026-06-09", limit: null, spendMtd: 41.07, disabled: false },
];

export type LogRow = {
  id: string;
  model: string;
  app: string;
  time: string;
  tokensIn: number;
  tokensOut: number;
  cost: number;
  latency: number;
  status: "200" | "error";
};

export const LOGS: LogRow[] = Array.from({ length: 40 }, (_, i) => {
  const m = MODELS[i % MODELS.length];
  const inTok = 800 + ((i * 977) % 12000);
  const outTok = 200 + ((i * 613) % 4000);
  const cost = (inTok * m.inputPrice + outTok * m.outputPrice) / 1_000_000;
  const minutes = i * 7 + 3;
  return {
    id: `req_${(982341 - i * 17).toString(16)}`,
    model: m.slug,
    app: ["production", "staging", "scroller-apps"][i % 3],
    time: `2026-06-12 ${String(14 - Math.floor(minutes / 60)).padStart(2, "0")}:${String(59 - (minutes % 60)).padStart(2, "0")}`,
    tokensIn: inTok,
    tokensOut: outTok,
    cost,
    latency: 0.4 + ((i * 37) % 31) / 10,
    status: i % 13 === 7 ? "error" : "200",
  };
});

export const ACTIVITY_DAYS = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const spend = 4 + Math.abs(Math.sin(i * 1.7)) * 22 + (i > 22 ? 8 : 0);
  return {
    date: `May ${day + 13 > 31 ? day - 18 : day + 13}`,
    spend: Math.round(spend * 100) / 100,
    requests: Math.round(spend * 38),
    tokens: Math.round(spend * 1.9 * 10) / 10, // millions
  };
});

export const CREDIT_HISTORY = [
  { date: "2026-06-01", type: "Purchase", amount: 100, method: "Visa ··4242" },
  { date: "2026-05-14", type: "Purchase", amount: 250, method: "Visa ··4242" },
  { date: "2026-05-01", type: "Auto top-up", amount: 50, method: "Visa ··4242" },
  { date: "2026-04-18", type: "Purchase", amount: 100, method: "Visa ··4242" },
  { date: "2026-04-02", type: "Promo credit", amount: 25, method: "—" },
];

export function fmtTokens(b: number) {
  return b >= 1000 ? `${(b / 1000).toFixed(2)}T` : `${b.toFixed(0)}B`;
}
export function fmtCtx(n: number) {
  return n >= 1_000_000 ? `${n / 1_000_000}M` : `${n / 1000}K`;
}
export function fmtMoney(n: number, dp = 2) {
  return `$${n.toFixed(dp)}`;
}
