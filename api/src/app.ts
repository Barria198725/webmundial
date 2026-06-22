import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import worldRoutes from "./presentation/routes/worldRoutes";
import authRoutes from "./presentation/routes/authRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", worldRoutes);
app.use("/auth", authRoutes);

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`API escuchando en http://0.0.0.0:${port}`);
});
