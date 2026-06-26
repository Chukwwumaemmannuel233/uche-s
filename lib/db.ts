import { Pool } from "pg";

let pool: Pool | null = null;

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

export function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  pool ??= new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 3,
    connectionTimeoutMillis: 3_000,
    idleTimeoutMillis: 5_000,
    query_timeout: 5_000,
    ssl:
      process.env.DATABASE_SSL === "false"
        ? false
        : { rejectUnauthorized: false },
  });

  return pool;
}

export function resetPool() {
  const currentPool = pool;
  pool = null;
  void currentPool?.end().catch(() => {});
}
