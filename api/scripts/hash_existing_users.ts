import { pool } from "../src/infra/database/mysqlConnection";
import bcrypt from "bcryptjs";

async function run() {
  const conn = await pool.getConnection();
  try {
    const [rows]: any = await conn.query("SELECT id, email, password_hash FROM users");
    for (const r of rows) {
      if (!r.password_hash || r.password_hash.length === 0) {
        const pass = "ChangeMe123!"; // default temporary password
        const hash = bcrypt.hashSync(pass, 10);
        await conn.query("UPDATE users SET password_hash = ? WHERE id = ?", [hash, r.id]);
        console.log(`Updated user ${r.email}`);
      }
    }
  } finally {
    conn.release();
    process.exit(0);
  }
}

run().catch((e) => { console.error(e); process.exit(1); });
