import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import worldRoutes from "./presentation/routes/worldRoutes";
import catalogoRoutes from "./presentation/routes/catalogoRoutes";
import authRoutes from "./presentation/routes/authRoutes";


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
        ('Pase premium', 'Acceso a funciones especiales de seguimiento y prediccion.', 19.99)
    `);
  }
}

async function start() {
  await ensureCatalogTable();
  app.listen(port, () => {
    console.log(`API escuchando en http://0.0.0.0:${port}`);
  });
}

start().catch((error) => {
  console.error("No se pudo iniciar la API", error);
  process.exit(1);
});
