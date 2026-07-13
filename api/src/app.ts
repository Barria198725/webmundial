import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import worldRoutes from "./presentation/routes/worldRoutes";
import catalogoRoutes from "./presentation/routes/catalogoRoutes";
import authRoutes from "./presentation/routes/authRoutes";
import { poolPromise } from "./infra/database/mysqlConnection";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", worldRoutes);
app.use("/api", catalogoRoutes);
app.use("/auth", authRoutes);

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

const port = Number(process.env.PORT || 3000);

async function ensureCatalogTable() {
  const pool = await poolPromise;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS catalog (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
      UNIQUE KEY uk_catalog_name (name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  const [rows] = await pool.query("SELECT COUNT(*) AS total FROM catalog");
  const total = Number((rows as any[])[0]?.total || 0);
  if (total === 0) {
    await pool.query(`
      INSERT INTO catalog (name, description, price) VALUES
        ('Balon oficial', 'Balon con diseno inspirado en la Copa Mundial 2026.', 89.99),
        ('Camiseta oficial', 'Camiseta edicion 2026 para coleccionistas y aficionados.', 59.99),
        ('Pase premium', 'Acceso a funciones especial de seguimiento y prediccion.', 19.99)
    `);
  }
}

async function ensureWorldSeedData() {
  const pool = await poolPromise;

  const [teamRows] = await pool.query("SELECT COUNT(*) AS total FROM teams");
  const teamCount = Number((teamRows as any[])[0]?.total || 0);
  if (teamCount === 0) {
    await pool.query(`
      INSERT INTO teams (name, country, stadiums, cities, matches) VALUES
        ('USA', 'United States', 10, 11, 60),
        ('Mexico', 'Mexico', 3, 3, 10),
        ('Canada', 'Canada', 3, 3, 10)
    `);
  }

  const [matchRows] = await pool.query("SELECT COUNT(*) AS total FROM matches");
  const matchCount = Number((matchRows as any[])[0]?.total || 0);
  if (matchCount === 0) {
    await pool.query(`
      INSERT INTO matches (
        \`date\`,
        stage,
        home_team_id,
        away_team_id,
        venue,
        status
      ) VALUES
        ('2026-06-11 18:00:00', 'Grupo A', 1, 2, 'Estadio Azteca', 'upcoming'),
        ('2026-06-12 21:00:00', 'Grupo B', 3, 1, 'BC Place', 'upcoming')
    `);
  }

  const [playerRows] = await pool.query("SELECT COUNT(*) AS total FROM players");
  const playerCount = Number((playerRows as any[])[0]?.total || 0);
  if (playerCount === 0) {
    await pool.query(`
      INSERT INTO players (name, team_id, goals) VALUES
        ('Christian Pulisic', 1, 3),
        ('Hirving Lozano', 2, 2),
        ('Alphonso Davies', 3, 1)
    `);
  }

  const [standingRows] = await pool.query("SELECT COUNT(*) AS total FROM standings");
  const standingCount = Number((standingRows as any[])[0]?.total || 0);
  if (standingCount === 0) {
    await pool.query(`
      INSERT INTO standings (team_id, group_name, played, won, draw, lost, points, goal_diff) VALUES
        (1, 'A', 2, 2, 0, 0, 6, 4),
        (2, 'A', 2, 1, 0, 1, 3, 0),
        (3, 'A', 2, 0, 0, 2, 0, -4)
    `);
  }

  const [userRows] = await pool.query("SELECT COUNT(*) AS total FROM users");
  const userCount = Number((userRows as any[])[0]?.total || 0);
  const passwordHash = await bcrypt.hash('Password123!', 10);
  if (userCount === 0) {
    await pool.query(`
      INSERT INTO users (name, email, password_hash, points) VALUES
        ('Administrador', 'admin@mundial2026.com', ?, 120)
    `, [passwordHash]);
  } else {
    await pool.query(`
      UPDATE users
      SET password_hash = ?
      WHERE password_hash IS NULL OR password_hash = ''
    `, [passwordHash]);
  }
}

async function start() {
  await ensureCatalogTable();
  await ensureWorldSeedData();
  app.listen(port, () => {
    console.log(`API escuchando en http://0.0.0.0:${port}`);
  });
}

start().catch((error) => {
  console.error("No se pudo iniciar la API", error);
  process.exit(1);
});
