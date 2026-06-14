import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const connectionName = process.env.DB_HOST || "db";
const port = Number(process.env.DB_PORT || 3306);
const user = process.env.DB_USER || "root";
const password = process.env.DB_PASSWORD || "root";
const database = process.env.DB_NAME || "catalogdb";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function createPoolWithRetry(retries = 5, delay = 1000) {
  let attempt = 0;
  while (true) {
    try {
      const pool = mysql.createPool({
        host: connectionName,
        port,
        user,
        password,
        database,
        charset: 'utf8mb4',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });

      // Try a quick connection
      const conn = await pool.getConnection();
      conn.release();
      return pool;
    } catch (err) {
      attempt++;
      if (attempt > retries) throw err;
      const backoff = delay * attempt;
      // eslint-disable-next-line no-console
      console.warn(`MySQL connection attempt ${attempt} failed, retrying in ${backoff}ms...`);
      await sleep(backoff);
    }
  }
}

export const poolPromise = createPoolWithRetry();

// Convenience export for existing code expecting `pool` (async getter)
export const pool = {
  query: async (...args: any[]) => {
    const p = await poolPromise;
    // `p.query` has overloads; use apply to forward args
    // @ts-ignore
    return (p.query as any).apply(p, args);
  },
  getConnection: async () => {
    const p = await poolPromise;
    return p.getConnection();
  },
};
