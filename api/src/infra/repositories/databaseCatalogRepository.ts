import { CatalogItem } from "../../domain/entities/catalogItem";
import { CatalogRepository } from "../../domain/repositories/catalogRepository";
import { pool } from "../database/mysqlConnection";

export class DatabaseCatalogRepository implements CatalogRepository {
  async getAll(): Promise<CatalogItem[]> {
    const [rows] = await pool.query("SELECT id, name, description, price FROM catalog");
    return (rows as any[]).map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      price: Number(row.price)
    }));
  }
}
