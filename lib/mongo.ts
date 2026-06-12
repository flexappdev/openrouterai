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
