import { MongoClient, type Db } from "mongodb";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function getDb(): Promise<Db | null> {
  if (!process.env.MONGODB_URI) return null;
  if (cachedDb) return cachedDb;
  try {
    cachedClient = new MongoClient(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    await cachedClient.connect();
    cachedDb = cachedClient.db(process.env.MONGODB_DB ?? "OPENROUTERAI");
    return cachedDb;
  } catch {
    cachedClient = null;
    cachedDb = null;
    return null;
  }
}

export type RequestLog = {
  ts?: Date;
  key_hash: string;
  model: string;
  status: string;
  latency_ms: number;
  prompt_tokens?: number;
  completion_tokens?: number;
  error_code?: number;
};

export async function logRequest(log: RequestLog): Promise<void> {
  const db = await getDb();
  if (!db) return;
  try {
    await db.collection("request_logs").insertOne({ ts: new Date(), ...log });
  } catch {
    // soft-fail — never block the response
  }
}

export async function recentLogs(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db
      .collection("request_logs")
      .find({}, { projection: { _id: 0 } })
      .sort({ ts: -1 })
      .limit(limit)
      .toArray();
  } catch {
    return [];
  }
}

// ─── API keys ───────────────────────────────────────────────────────

export type StoredApiKey = {
  id: string;
  owner_email: string;
  name: string;
  hash: string;       // sha256 of full key
  prefix: string;     // sk-or-v1-XXXXXXXX (first 12 chars)
  suffix: string;     // last 4 chars
  created: string;    // ISO date
  last_used: string;  // ISO date or '—'
  limit_usd: number | null;
  spend_mtd_usd: number;
  disabled: boolean;
};

export type CreditEntry = {
  ts: Date;
  owner_email: string;
  type: "purchase" | "auto_topup" | "promo" | "refund";
  amount_usd: number;
  method: string;
  stripe_session_id?: string;
};

export async function listKeys(ownerEmail: string): Promise<StoredApiKey[]> {
  const db = await getDb();
  if (!db) return [];
  try {
    const rows = await db
      .collection<StoredApiKey>("api_keys")
      .find({ owner_email: ownerEmail }, { projection: { _id: 0, hash: 0 } })
      .sort({ created: -1 })
      .toArray();
    return rows as StoredApiKey[];
  } catch {
    return [];
  }
}

export async function createKey(key: StoredApiKey): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  try {
    await db.collection("api_keys").insertOne(key);
    return true;
  } catch {
    return false;
  }
}

export async function updateKey(
  id: string,
  ownerEmail: string,
  patch: Partial<Pick<StoredApiKey, "disabled" | "name" | "limit_usd">>
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  try {
    const res = await db
      .collection("api_keys")
      .updateOne({ id, owner_email: ownerEmail }, { $set: patch });
    return res.matchedCount > 0;
  } catch {
    return false;
  }
}

export async function deleteKey(id: string, ownerEmail: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  try {
    const res = await db
      .collection("api_keys")
      .deleteOne({ id, owner_email: ownerEmail });
    return res.deletedCount > 0;
  } catch {
    return false;
  }
}

export async function recordCredit(entry: CreditEntry): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  try {
    await db.collection("credit_history").insertOne(entry);
    return true;
  } catch {
    return false;
  }
}

export async function creditHistory(ownerEmail: string, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db
      .collection<CreditEntry>("credit_history")
      .find({ owner_email: ownerEmail }, { projection: { _id: 0 } })
      .sort({ ts: -1 })
      .limit(limit)
      .toArray();
  } catch {
    return [];
  }
}
