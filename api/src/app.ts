import express from "express";
import dotenv from "dotenv";
import catalogoRoutes from "./presentation/routes/catalogoRoutes";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api", catalogoRoutes);

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`API escuchando en http://0.0.0.0:${port}`);
});
