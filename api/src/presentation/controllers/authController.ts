import { Request, Response } from "express";
import { pool } from "../../infra/database/mysqlConnection";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";

export class AuthController {
  async login(req: Request, res: Response) {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "email and password required" });

    try {
      const [rows]: any = await pool.query("SELECT id, name, email, points, password_hash FROM users WHERE email = ? LIMIT 1", [email]);
      if (!rows || rows.length === 0) return res.status(401).json({ error: "Invalid credentials" });

      const userRow = rows[0];
      const hash = userRow.password_hash;

      if (!hash) return res.status(401).json({ error: "Invalid credentials" });

      const match = await bcrypt.compare(password, hash);
      if (!match) return res.status(401).json({ error: "Invalid credentials" });

      const user = {
        id: userRow.id,
        name: userRow.name,
        email: userRow.email,
        points: userRow.points,
      };

      // Casts to satisfy TypeScript typings for jsonwebtoken
      const token = jwt.sign({ sub: user.id, email: user.email } as any, JWT_SECRET as any, { expiresIn: JWT_EXPIRES as any });

      return res.json({ user, token });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      return res.status(500).json({ error: "internal error" });
    }
  }
}
