import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export type Database = ReturnType<typeof drizzle<typeof schema>>;

let db: Database | undefined;

export function getDb(): Database {
  if (db) return db;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is unavailable. Set it to your Postgres connection string in .env.local for development, or in the Vercel project's environment variables."
    );
  }

  // One connection per serverless invocation, and no prepared statements, so a
  // transaction-mode pooler (Supabase :6543, Neon pooled) stays happy.
  db = drizzle(postgres(url, { max: 1, prepare: false }), { schema });
  return db;
}
