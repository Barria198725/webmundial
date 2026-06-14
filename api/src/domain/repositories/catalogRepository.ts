import { CatalogItem } from "../entities/catalogItem";

export interface CatalogRepository {
  getAll(): Promise<CatalogItem[]>;
}
